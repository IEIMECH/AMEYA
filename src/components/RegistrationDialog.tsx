"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Upload, CheckCircle2, AlertCircle, Loader2, ArrowRight, RefreshCw, FileText, Image as ImageIcon, ShieldCheck } from "lucide-react";
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

export default function RegistrationDialog({ event: initialEvent, availableEvents, onClose }: RegistrationDialogProps) {
  const activeOptions = availableEvents && availableEvents.length > 0 ? availableEvents : events;
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Sync event if prop changes
  useEffect(() => {
    setCurrentEvent(initialEvent);
  }, [initialEvent]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        collegeIdCard: "Invalid file format. Only JPG, JPEG, and PNG images are supported.",
      }));
      return;
    }

    // Validate size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        collegeIdCard: "File size exceeds 5MB limit. Please compress or choose a smaller image.",
      }));
      return;
    }

    // Clean up previous preview URL
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
          {/* Header */}
          <div className={styles.dialogHead}>
            <div className={styles.eventBadge}>
              <span className={styles.statusDot} />
              <div className={styles.headMeta}>
                <span className={styles.kicker}>OFFICIAL EVENT REGISTRATION // SOLO</span>
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
              <div className={styles.bannerInfo}>
                <span className={styles.bannerLabel}>SELECTED ARENA</span>
                <span className={styles.bannerMeta}>
                  {currentEvent.category.toUpperCase()} // DAY 0{currentEvent.day}
                </span>
              </div>
              <div className={styles.eventSwitcherWrapper}>
                <label htmlFor="event-switch-select" className={styles.switchLabel}>SWITCH ARENA:</label>
                <select
                  id="event-switch-select"
                  className={styles.switchSelect}
                  value={currentEvent.id}
                  onChange={(e) => {
                    const found = (activeOptions as Event[]).find((ev: Event) => ev.id === e.target.value);
                    if (found) setCurrentEvent(found);
                  }}
                >
                  {(activeOptions as Event[]).map((ev: Event) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.name} ({ev.category} - Day {ev.day})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className={styles.dialogBody}>
            {/* SUCCESS STATE */}
            {successData ? (
              <div className={styles.successState}>
                <div className={styles.successIconBox}>
                  <CheckCircle2 size={44} className={styles.successIcon} />
                </div>
                <div className={styles.successKicker}>REGISTRATION CONFIRMED</div>
                <h2 className={styles.successTitle}>{successData.eventName}</h2>
                <div className={styles.successSubtitle}>
                  DAY 0{successData.day} // {successData.category.toUpperCase()} (SOLO)
                </div>

                <div className={styles.successDocketCard}>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>PARTICIPANT</span>
                    <strong className={styles.docketVal}>{successData.participantName}</strong>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>REGISTRATION ID</span>
                    <strong className={styles.docketValRed}>{successData.ticketId}</strong>
                  </div>
                  <div className={styles.docketRow}>
                    <span className={styles.docketKey}>DISPATCH EMAIL</span>
                    <strong className={styles.docketVal}>{successData.email}</strong>
                  </div>

                  <div className={styles.confirmationBadgeBox}>
                    <ShieldCheck size={28} className={styles.confirmationBadgeIcon} />
                    <span className={styles.confirmationBadgeText}>
                      ENTRY CONFIRMED // NO QR SCAN NEEDED
                    </span>
                    <span className={styles.confirmationBadgeSubtext}>
                      Present your Registration ID or College ID card at the venue desk. Event coordinators will mark your attendance directly in the portal.
                    </span>
                  </div>
                </div>

                <p className={styles.successNotice}>
                  Your registration has been securely committed to the event registry.
                </p>

                <div className={styles.successActions}>
                  <button type="button" onClick={onClose} className={styles.primaryActionBtn}>
                    <span>BACK TO EVENTS</span>
                    <ArrowRight size={14} />
                  </button>
                  <Link href={`/ticket/${successData.ticketId}`} className={styles.secondaryLinkBtn}>
                    <span>VIEW CREDENTIAL DOCKET</span>
                  </Link>
                </div>
              </div>
            ) : submissionError ? (
              /* ERROR STATE */
              <div className={styles.errorState}>
                <div className={styles.errorIconBox}>
                  <AlertCircle size={44} className={styles.errorIcon} />
                </div>
                <div className={styles.errorKicker}>REGISTRATION FAILED</div>
                <h3 className={styles.errorTitle}>We Couldn&apos;t Complete Your Registration</h3>
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
                    <span>CANCEL</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE FORM */
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.formSectionHeader}>
                  <span className={styles.sectionKicker}>PARTICIPANT DETAILS</span>
                  <p className={styles.sectionDesc}>
                    All fields are required. All AMEYA &apos;26 competitions are solo entries.
                  </p>
                </div>

                {/* 1. Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="reg-name" className={styles.label}>
                    Full Name <span className={styles.req}>*</span>
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>

                {/* 2. Branch */}
                <div className={styles.formGroup}>
                  <label htmlFor="reg-branch" className={styles.label}>
                    Branch / Department <span className={styles.req}>*</span>
                  </label>
                  <input
                    id="reg-branch"
                    type="text"
                    value={form.branch}
                    onChange={(e) => handleFieldChange("branch", e.target.value)}
                    placeholder="e.g. Mechanical Engineering, Robotics, CSE"
                    className={`${styles.input} ${errors.branch ? styles.inputError : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.branch && <span className={styles.fieldError}>{errors.branch}</span>}
                </div>

                {/* 3. College Roll Number */}
                <div className={styles.formGroup}>
                  <label htmlFor="reg-roll" className={styles.label}>
                    College Roll Number <span className={styles.req}>*</span>
                  </label>
                  <input
                    id="reg-roll"
                    type="text"
                    value={form.collegeRollNumber}
                    onChange={(e) => handleFieldChange("collegeRollNumber", e.target.value)}
                    placeholder="e.g. 22BQ1A0301"
                    className={`${styles.input} ${errors.collegeRollNumber ? styles.inputError : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.collegeRollNumber && (
                    <span className={styles.fieldError}>{errors.collegeRollNumber}</span>
                  )}
                </div>

                {/* 4. Email ID */}
                <div className={styles.formGroup}>
                  <label htmlFor="reg-email" className={styles.label}>
                    Email ID <span className={styles.req}>*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="e.g. rahul.sharma@gmail.com"
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>

                {/* 5. Phone Number */}
                <div className={styles.formGroup}>
                  <label htmlFor="reg-phone" className={styles.label}>
                    Phone Number <span className={styles.req}>*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="e.g. 9876543210"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>

                {/* 6. College ID Card Upload */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    College ID Card Image <span className={styles.req}>*</span>
                  </label>

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
                        alt="Uploaded College ID card thumbnail"
                        className={styles.previewThumbnail}
                        draggable={false}
                      />
                      <div className={styles.previewInfo}>
                        <span className={styles.previewFilename}>{form.collegeIdCardFile.name}</span>
                        <span className={styles.previewFilesize}>
                          {(form.collegeIdCardFile.size / 1024).toFixed(1)} KB &bull; Verified Image
                        </span>
                      </div>
                      <div className={styles.previewActions}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={styles.replaceBtn}
                          disabled={isSubmitting}
                        >
                          Replace
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
                      className={`${styles.dropZone} ${isDraggingOver ? styles.dropZoneActive : ""} ${
                        errors.collegeIdCard ? styles.dropZoneError : ""
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(true);
                      }}
                      onDragLeave={() => setIsDraggingOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileSelection(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <Upload size={22} className={styles.uploadIcon} />
                      <div className={styles.dropPrompt}>
                        <span className={styles.dropPromptPrimary}>Click to upload or drag &amp; drop</span>
                        <span className={styles.dropPromptFormats}>Supported image formats: JPG / JPEG / PNG (Max 5MB)</span>
                      </div>
                    </div>
                  )}

                  {errors.collegeIdCard && (
                    <span className={styles.fieldError}>{errors.collegeIdCard}</span>
                  )}
                </div>

                {/* Privacy & Security Baseline Notice */}
                <div className={styles.securityNotice}>
                  <ShieldCheck size={13} className={styles.securityIcon} />
                  <span>
                    Your College ID card image is stored securely and used solely for student affiliation verification. It is never exposed publicly.
                  </span>
                </div>

                {/* Submit CTA */}
                <div className={styles.submitRow}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className={styles.spinningIcon} />
                        <span>RECORDING REGISTRATION...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT REGISTRATION</span>
                        <ArrowRight size={14} />
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
