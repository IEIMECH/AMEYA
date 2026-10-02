"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  User,
  Hash,
  GraduationCap,
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
  Check,
} from "lucide-react";
import { events, Event } from "@/data/events";
import styles from "./RegistrationDialog.module.css";

interface RegistrationDialogProps {
  event: Event;
  availableEvents?: Event[];
  onClose: () => void;
}

interface RegistrationFormData {
  name: string;
  branch: string;
  collegeRollNumber: string;
  email: string;
  phone: string;
  collegeIdCardFile: File | null;
  collegeIdCardPreview: string | null;
}

interface FormErrors {
  name?: string;
  branch?: string;
  collegeRollNumber?: string;
  email?: string;
  phone?: string;
  collegeIdCard?: string;
}

interface SuccessPayload {
  ticketId: string;
  eventName: string;
  day: number;
  category: string;
  participantName: string;
  email: string;
}

export default function RegistrationDialog({
  event: initialEvent,
  availableEvents,
  onClose,
}: RegistrationDialogProps) {
  const activeOptions =
    availableEvents && availableEvents.length > 0 ? availableEvents : events;
  const [currentEvent, setCurrentEvent] = useState<Event>(initialEvent);
  const [form, setForm] = useState<RegistrationFormData>({
    name: "",
    branch: "",
    collegeRollNumber: "",
    email: "",
    phone: "",
    collegeIdCardFile: null,
    collegeIdCardPreview: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessPayload | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogCardRef = useRef<HTMLDivElement>(null);

  // Sync state if initialEvent changes externally
  useEffect(() => {
    setCurrentEvent(initialEvent);
  }, [initialEvent]);

  // Lock body scroll while modal is active & handle ESC key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (form.collegeIdCardPreview) {
        URL.revokeObjectURL(form.collegeIdCardPreview);
      }
    };
  }, [form.collegeIdCardPreview]);

  const handleFieldChange = (field: keyof RegistrationFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileSelection = (file: File | null) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrors((prev) => ({
        ...prev,
        collegeIdCard: "Please upload a valid JPG or PNG image.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        collegeIdCard: "Image size must be less than 5MB.",
      }));
      return;
    }

    if (form.collegeIdCardPreview) {
      URL.revokeObjectURL(form.collegeIdCardPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      collegeIdCardFile: file,
      collegeIdCardPreview: previewUrl,
    }));
    setErrors((prev) => ({ ...prev, collegeIdCard: undefined }));
  };

  const handleRemoveFile = () => {
    if (form.collegeIdCardPreview) {
      URL.revokeObjectURL(form.collegeIdCardPreview);
    }
    setForm((prev) => ({
      ...prev,
      collegeIdCardFile: null,
      collegeIdCardPreview: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full Name is required.";
    }

    if (!form.branch.trim()) {
      newErrors.branch = "Engineering Branch / Department is required.";
    }

    if (!form.collegeRollNumber.trim()) {
      newErrors.collegeRollNumber = "College Roll Number is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Email ID is required.";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^[+]?[0-9\s-]{10,15}$/;
    if (!form.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    } else if (!phoneRegex.test(form.phone.trim().replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit telephone number.";
    }

    if (!form.collegeIdCardFile) {
      newErrors.collegeIdCard = "College ID card image upload is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const formData = new FormData();
      formData.append("eventId", currentEvent.id);
      formData.append("eventName", currentEvent.name);
      formData.append("day", String(currentEvent.day));
      formData.append("category", currentEvent.category);
      formData.append("name", form.name.trim());
      formData.append("branch", form.branch.trim());
      formData.append("collegeRollNumber", form.collegeRollNumber.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("phone", form.phone.trim());

      if (form.collegeIdCardFile) {
        formData.append("collegeIdCard", form.collegeIdCardFile);
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete registration.");
      }
      setSuccessData({
        ticketId: data.ticketId,
        eventName: currentEvent.name,
        day: currentEvent.day,
        category: currentEvent.category,
        participantName: form.name.trim(),
        email: form.email.trim(),
      });
    } catch (err: any) {
      console.error("Registration error:", err);
      setSubmissionError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.dialogBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.dialogContainer}>
        <div
          ref={dialogCardRef}
          className={styles.dialogInner}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Laser Accent */}
          <div className={styles.topLaserAccent} />

          {/* Header */}
          <div className={styles.dialogHead}>
            <div className={styles.eventBadge}>
              <div className={styles.statusIndicator}>
                <div className={styles.statusDot} />
                <div className={styles.statusPulse} />
              </div>
              <div className={styles.headMeta}>
                <span className={styles.kicker}>
                  <Sparkles size={11} />
                  OFFICIAL REGISTRATION // AMEYA &apos;26
                </span>
                <h3 className={styles.eventName}>{currentEvent.name}</h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close registration dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Subheader / Event Selector Banner */}
          {!successData && !submissionError && (
            <div className={styles.eventSelectorBanner}>
              <div className={styles.bannerPills}>
                <span className={styles.categoryPill}>
                  ⚡ {currentEvent.category.toUpperCase()} SOLO
                </span>
                <span className={styles.dayPill}>
                  DAY 0{currentEvent.day} // OCT 0{currentEvent.day === 1 ? "8" : "9"}
                </span>
              </div>
              <div className={styles.eventSwitcherWrapper}>
                <label htmlFor="event-switch-select" className={styles.switchLabel}>
                  SWITCH ARENA:
                </label>
                <div className={styles.selectDropdownWrapper}>
                  <select
                    id="event-switch-select"
                    className={styles.switchSelect}
                    value={currentEvent.id}
                    onChange={(e) => {
                      const found = (activeOptions as Event[]).find(
                        (ev: Event) => ev.id === e.target.value
                      );
                      if (found) setCurrentEvent(found);
                    }}
                  >
                    {(activeOptions as Event[]).map((ev: Event) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name} ({ev.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} className={styles.selectChevron} />
                </div>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className={styles.dialogBody}>
            {/* SUCCESS STATE */}
            {successData ? (
              <div className={styles.successState}>
                <div className={styles.successIconBox}>
                  <CheckCircle2 size={42} className={styles.successIcon} />
                </div>
                <div className={styles.successKicker}>REGISTRATION CONFIRMED</div>
                <h2 className={styles.successTitle}>{successData.eventName}</h2>
                <div className={styles.successSubtitle}>
                  DAY 0{successData.day} // {successData.category.toUpperCase()} SOLO
                </div>

                <div className={styles.successDocketCard}>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>PARTICIPANT</span>
                    <strong className={styles.docketVal}>{successData.participantName}</strong>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>TICKET CODE</span>
                    <strong className={styles.docketValRed}>{successData.ticketId}</strong>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>DISPATCH EMAIL</span>
                    <strong className={styles.docketVal}>{successData.email}</strong>
                  </div>

                  <div className={styles.confirmationBadgeBox}>
                    <CheckCircle2 size={18} className={styles.confirmationBadgeIcon} />
                    <span className={styles.confirmationBadgeText}>
                      ENTRY CLEARANCE ISSUED
                    </span>
                    <p className={styles.confirmationBadgeSubtext}>
                      Confirmation email with digital pass sent. Present your Ticket ID or College ID card at the desk upon arrival.
                    </p>
                  </div>
                </div>

                <div className={styles.successActions}>
                  <button type="button" onClick={onClose} className={styles.primaryActionBtn}>
                    <span>DONE &bull; BACK TO EVENTS</span>
                  </button>
                  <Link href={`/ticket/${successData.ticketId}`} className={styles.secondaryLinkBtn}>
                    <span>VIEW PASS ONLINE</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : submissionError ? (
              /* ERROR STATE */
              <div className={styles.errorState}>
                <div className={styles.errorIconBox}>
                  <AlertCircle size={42} className={styles.errorIcon} />
                </div>
                <div className={styles.errorKicker}>REGISTRATION NOTICE</div>
                <h3 className={styles.errorTitle}>Could Not Finalize Entry</h3>
                <p className={styles.errorMessageText}>{submissionError}</p>

                <div className={styles.errorActions}>
                  <button
                    type="button"
                    onClick={() => setSubmissionError(null)}
                    className={styles.primaryActionBtn}
                  >
                    <RefreshCw size={14} />
                    <span>TRY AGAIN</span>
                  </button>
                  <button type="button" onClick={onClose} className={styles.secondaryLinkBtn}>
                    <span>DISMISS</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE FORM */
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                {/* Section 01: Candidate Telemetry */}
                <div className={styles.sectionHeaderPill}>
                  <User size={14} className={styles.sectionHeaderIcon} />
                  <span className={styles.sectionHeaderTitle}>
                    01 // CANDIDATE TELEMETRY
                  </span>
                </div>

                <div className={styles.formGrid}>
                  {/* 1. Full Name */}
                  <div className={styles.formGroup}>
                    <label htmlFor="reg-name" className={styles.label}>
                      <User size={12} className={styles.labelIcon} />
                      Full Name <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <User size={15} className={styles.inputIcon} />
                      <input
                        id="reg-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                  </div>

                  {/* 2. College Roll Number */}
                  <div className={styles.formGroup}>
                    <label htmlFor="reg-roll" className={styles.label}>
                      <Hash size={12} className={styles.labelIcon} />
                      Roll Number <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Hash size={15} className={styles.inputIcon} />
                      <input
                        id="reg-roll"
                        type="text"
                        value={form.collegeRollNumber}
                        onChange={(e) => handleFieldChange("collegeRollNumber", e.target.value)}
                        placeholder="e.g. 22BQ1A0301"
                        className={`${styles.input} ${errors.collegeRollNumber ? styles.inputError : ""}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.collegeRollNumber && (
                      <span className={styles.fieldError}>{errors.collegeRollNumber}</span>
                    )}
                  </div>

                  {/* 3. Engineering Branch / Dept (Full Width) */}
                  <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                    <label htmlFor="reg-branch" className={styles.label}>
                      <GraduationCap size={13} className={styles.labelIcon} />
                      Engineering Branch / Department <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <GraduationCap size={15} className={styles.inputIcon} />
                      <input
                        id="reg-branch"
                        type="text"
                        value={form.branch}
                        onChange={(e) => handleFieldChange("branch", e.target.value)}
                        placeholder="e.g. Mechanical Engineering / Robotics / CSE"
                        className={`${styles.input} ${errors.branch ? styles.inputError : ""}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.branch && <span className={styles.fieldError}>{errors.branch}</span>}
                  </div>

                  {/* 4. Email ID */}
                  <div className={styles.formGroup}>
                    <label htmlFor="reg-email" className={styles.label}>
                      <Mail size={12} className={styles.labelIcon} />
                      Email ID (For Pass) <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Mail size={15} className={styles.inputIcon} />
                      <input
                        id="reg-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                  </div>

                  {/* 5. Phone Number */}
                  <div className={styles.formGroup}>
                    <label htmlFor="reg-phone" className={styles.label}>
                      <Phone size={12} className={styles.labelIcon} />
                      WhatsApp Phone <span className={styles.req}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Phone size={15} className={styles.inputIcon} />
                      <input
                        id="reg-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        placeholder="e.g. 9876543210"
                        className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                  </div>
                </div>

                {/* Section 02: College Credential Verification */}
                <div className={styles.sectionHeaderPill}>
                  <ShieldCheck size={14} className={styles.sectionHeaderIcon} />
                  <span className={styles.sectionHeaderTitle}>
                    02 // COLLEGE CREDENTIAL VERIFICATION
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={(e) => handleFileSelection(e.target.files ? e.target.files[0] : null)}
                    className={styles.hiddenFileInput}
                    id="college-id-input"
                  />

                  {form.collegeIdCardFile && form.collegeIdCardPreview ? (
                    <div className={styles.filePreviewCard}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.collegeIdCardPreview}
                        alt="Uploaded College ID card preview"
                        className={styles.previewThumbnail}
                        draggable={false}
                      />
                      <div className={styles.previewInfo}>
                        <span className={styles.previewFilename}>{form.collegeIdCardFile.name}</span>
                        <span className={styles.previewFilesize}>
                          <Check size={12} />
                          {(form.collegeIdCardFile.size / 1024).toFixed(1)} KB &bull; Verified ID Attached
                        </span>
                      </div>
                      <div className={styles.previewActions}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={styles.replaceBtn}
                          disabled={isSubmitting}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className={styles.removeBtn}
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${styles.uploadDropzone} ${errors.collegeIdCard ? styles.uploadDropzoneError : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <div className={styles.uploadIconCircle}>
                        <Upload size={18} />
                      </div>
                      <p className={styles.uploadMainText}>
                        Upload Student / College ID Card
                      </p>
                      <p className={styles.uploadSubText}>
                        Click or drag image here &bull; JPG or PNG format (Max 5MB)
                      </p>
                    </div>
                  )}
                  {errors.collegeIdCard && (
                    <span className={styles.fieldError}>{errors.collegeIdCard}</span>
                  )}
                </div>

                {/* Trust Highlights */}
                <div className={styles.trustBar}>
                  <div className={styles.trustItem}>
                    <Check size={13} className={styles.trustIcon} />
                    <span>Free Registration</span>
                  </div>
                  <div className={styles.trustItem}>
                    <Check size={13} className={styles.trustIcon} />
                    <span>Instant Ticket Dispatch</span>
                  </div>
                  <div className={styles.trustItem}>
                    <Check size={13} className={styles.trustIcon} />
                    <span>Verified by IEISAME</span>
                  </div>
                </div>

                {/* Submit Row */}
                <div className={styles.submitRow}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                    id="submit-registration-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className={styles.spinningIcon} />
                        <span>PROCESSING TRANSMISSION...</span>
                      </>
                    ) : (
                      <>
                        <span>CONFIRM &amp; GENERATE PASS</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
