"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, ChevronLeft, CheckCircle, Loader2, Plus, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import type { Event } from "@/data/events";
import styles from "./RegistrationDialog.module.css";

interface Member {
  name: string;
  email: string;
  phone: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  teamName: string;
  members: Member[];
}

interface FieldError {
  code: string;
  message: string;
}

type FormErrors = Partial<Record<string, FieldError>>;

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate / Alumni"];
const STEPS_SOLO = ["Delegate Info", "Confirm & Transmit"];
const STEPS_TEAM = ["Cadre Lead", "Squad Members", "Confirm & Transmit"];

function initForm(): FormData {
  return {
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    teamName: "",
    members: [{ name: "", email: "", phone: "" }],
  };
}

interface Props {
  event: Event | null;
  onClose: () => void;
}

export default function RegistrationDialog({ event, onClose }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initForm());
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "server_error" | "network_error">("idle");
  const [ticketId, setTicketId] = useState("");

  const isTeam = event?.type === "team";
  const STEPS = isTeam ? STEPS_TEAM : STEPS_SOLO;
  const totalSteps = STEPS.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (event) {
      if (!dialog.open) {
        dialog.showModal();
      }
      setStep(0);
      setErrors({});
      setStatus("idle");
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [event]);

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function validatePhone(phone: string): boolean {
    const clean = phone.replace(/\D/g, "");
    return clean.length >= 10 && clean.length <= 13;
  }

  function validateStep(targetStep: number): boolean {
    const newErrors: FormErrors = {};

    if (targetStep === 0) {
      if (isTeam && !form.teamName.trim()) {
        newErrors.teamName = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please specify your official engineering team designation.",
        };
      }
      if (!form.name.trim()) {
        newErrors.name = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please enter your full delegate name.",
        };
      }
      if (!form.email.trim()) {
        newErrors.email = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please provide an email address for credential dispatch.",
        };
      } else if (!validateEmail(form.email)) {
        newErrors.email = {
          code: "INPUT ERROR // INVALID EMAIL",
          message: "Please enter a valid institutional or personal email address.",
        };
      }
      if (!form.phone.trim()) {
        newErrors.phone = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please enter your contact mobile number.",
        };
      } else if (!validatePhone(form.phone)) {
        newErrors.phone = {
          code: "INPUT ERROR // INVALID PHONE",
          message: "Please enter a valid 10-digit mobile phone number.",
        };
      }
      if (!form.college.trim()) {
        newErrors.college = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "College or institutional affiliation is required.",
        };
      }
      if (!form.year) {
        newErrors.year = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Select your current academic year of study.",
        };
      }
    }

    if (targetStep === 1 && isTeam) {
      form.members.forEach((m, idx) => {
        if (!m.name.trim()) {
          newErrors[`member_${idx}_name`] = {
            code: "INPUT ERROR // REQUIRED FIELD EMPTY",
            message: `Member ${idx + 1} name is required.`,
          };
        }
        if (!m.email.trim()) {
          newErrors[`member_${idx}_email`] = {
            code: "INPUT ERROR // REQUIRED FIELD EMPTY",
            message: `Member ${idx + 1} email is required.`,
          };
        } else if (!validateEmail(m.email)) {
          newErrors[`member_${idx}_email`] = {
            code: "INPUT ERROR // INVALID EMAIL",
            message: `Member ${idx + 1} email address is invalid.`,
          };
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  }

  function updateField(field: keyof FormData, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function updateMember(i: number, field: keyof Member, val: string) {
    setForm((f) => {
      const members = [...f.members];
      members[i] = { ...members[i], [field]: val };
      return { ...f, members };
    });
    const errorKey = `member_${i}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  }

  function addMember() {
    setForm((f) => ({
      ...f,
      members: [...f.members, { name: "", email: "", phone: "" }],
    }));
  }

  function removeMember(i: number) {
    setForm((f) => ({
      ...f,
      members: f.members.filter((_, idx) => idx !== i),
    }));
  }

  async function handleSubmit() {
    if (!validateStep(step)) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: { id: event?.id, name: event?.name },
          form,
          isTeam,
        }),
      });

      if (!res.ok) {
        setStatus("server_error");
        return;
      }

      const data = await res.json();
      const generatedId = data.ticketId || `AMEYA-2026-REG-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedId);
      setStatus("success");
    } catch {
      setStatus("network_error");
    }
  }

  function handleClose() {
    onClose();
  }

  function handleNavigateSuccess() {
    handleClose();
    const query = new URLSearchParams({
      id: ticketId,
      event: event?.name || "AMEYA '26 Event",
      date: event?.day ? `Day 0${event.day} (October 0${event.day + 3}, 2026)` : "October 04–05, 2026",
      venue: event?.venue || "VVIIT Mechanical Engineering Arena",
      name: form.name,
      type: isTeam ? "Team Leader" : "Individual Delegate",
    });
    router.push(`/registration/success?${query.toString()}`);
  }

  if (!event) return null;

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <div className={styles.dialogInner}>
        {/* Header with technical badge */}
        <div className={styles.dialogHead}>
          <div className={styles.eventBadge}>
            <span className={styles.statusDot} />
            <span className={styles.kicker}>SYS: REGISTRATION // PROTOCOL</span>
            <span className={styles.eventName}>{event.name}</span>
            <span className={styles.eventType}>
              {event.type === "team" ? `SQUAD CADRE · ${event.teamSize}` : "SOLO OPERATOR"}
            </span>
          </div>
          <button
            suppressHydrationWarning
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close Registration Dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        {status !== "success" && (
          <div className={styles.progress}>
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`${styles.progressStep} ${
                  i < step ? styles.progressDone : i === step ? styles.progressActive : ""
                }`}
              >
                <div className={styles.progressDot}>
                  {i < step ? <CheckCircle size={13} /> : `0${i + 1}`}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Dialog Body */}
        <div className={styles.dialogBody}>
          {status === "success" ? (
            <div className={styles.successWrapper}>
              <div className={styles.successHeader}>
                <div className={styles.successPulse}>
                  <ShieldCheck size={28} color="#E51D25" />
                </div>
                <div className={styles.successKicker}>PROTOCOL // HANDSHAKE CONFIRMED</div>
                <h3 className={styles.successTitle}>Registration Registered.</h3>
                <p className={styles.successDesc}>
                  Your accreditation docket for <strong>{event.name}</strong> has been committed to the AMEYA &apos;26 central mainframe.
                </p>
              </div>

              <div className={styles.docketSummary}>
                <div className={styles.docketRow}>
                  <span className={styles.docketLabel}>REGISTRATION ID</span>
                  <code className={styles.docketVal}>{ticketId}</code>
                </div>
                <div className={styles.docketRow}>
                  <span className={styles.docketLabel}>DELEGATE</span>
                  <span className={styles.docketVal}>{form.name}</span>
                </div>
                <div className={styles.docketRow}>
                  <span className={styles.docketLabel}>DISPATCH DESTINATION</span>
                  <span className={styles.docketVal}>{form.email}</span>
                </div>
              </div>

              <div className={styles.successActions}>
                <button
                  type="button"
                  className={styles.viewDocketBtn}
                  onClick={handleNavigateSuccess}
                >
                  VIEW SYSTEM DOSSIER →
                </button>
                <button
                  type="button"
                  className={styles.dismissBtn}
                  onClick={handleClose}
                >
                  DISMISS PANEL
                </button>
              </div>
            </div>
          ) : status === "server_error" ? (
            <div className={styles.systemErrorBanner} role="alert">
              <span className={styles.errorIndicator} />
              <div className={styles.systemErrorContent}>
                <span className={styles.errorLabel}>SERVER ERROR // PROTOCOL REFUSED</span>
                <p className={styles.errorMessage}>
                  The upstream registry could not persist your registration dossier. Your inputs have been preserved. Please retry transmission.
                </p>
                <button
                  suppressHydrationWarning
                  className={styles.retryBtn}
                  onClick={handleSubmit}
                >
                  RETRY HANDSHAKE
                </button>
              </div>
            </div>
          ) : status === "network_error" ? (
            <div className={styles.systemErrorBanner} role="alert">
              <span className={styles.errorIndicator} />
              <div className={styles.systemErrorContent}>
                <span className={styles.errorLabel}>NETWORK FAILURE // PACKET LOSS</span>
                <p className={styles.errorMessage}>
                  Connection to the AMEYA registration gateway timed out. All entered data remains preserved.
                </p>
                <button
                  suppressHydrationWarning
                  className={styles.retryBtn}
                  onClick={handleSubmit}
                >
                  RETRY TRANSMISSION
                </button>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <StepLeaderInfo
                  form={form}
                  isTeam={isTeam}
                  errors={errors}
                  onChange={updateField}
                />
              )}
              {step === 1 && isTeam && (
                <StepMembers
                  members={form.members}
                  errors={errors}
                  onChange={updateMember}
                  onAdd={addMember}
                  onRemove={removeMember}
                />
              )}
              {step === totalSteps - 1 && (
                <StepConfirm form={form} event={event} isTeam={isTeam} />
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        {status !== "success" && status !== "server_error" && status !== "network_error" && (
          <div className={styles.dialogFoot}>
            {step > 0 && (
              <button
                suppressHydrationWarning
                type="button"
                className={styles.backBtn}
                onClick={() => setStep((s) => s - 1)}
              >
                <ChevronLeft size={16} /> BACK
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps - 1 ? (
              <button
                suppressHydrationWarning
                type="button"
                className={styles.nextBtn}
                onClick={handleNext}
              >
                PROCEED <ChevronRight size={16} />
              </button>
            ) : (
              <button
                suppressHydrationWarning
                type="button"
                className={styles.submitBtn}
                disabled={status === "loading"}
                onClick={handleSubmit}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className={styles.spin} />
                    TRANSMITTING DOSSIER...
                  </>
                ) : (
                  "CONFIRM & TRANSMIT REGISTRATION"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}

function StepLeaderInfo({
  form,
  isTeam,
  errors,
  onChange,
}: {
  form: FormData;
  isTeam: boolean;
  errors: FormErrors;
  onChange: (f: keyof FormData, v: string) => void;
}) {
  return (
    <div className={styles.formGrid}>
      {isTeam && (
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>
            SQUAD / TEAM MONIKER <span className={styles.req}>*</span>
          </label>
          <input
            suppressHydrationWarning
            className={`${styles.input} ${errors.teamName ? styles.inputError : ""}`}
            placeholder="e.g. Apex Dynamics"
            value={form.teamName}
            onChange={(e) => onChange("teamName", e.target.value)}
          />
          {errors.teamName && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIndicator} />
              <div className={styles.errorTextGroup}>
                <span className={styles.errorLabel}>{errors.teamName.code}</span>
                <span className={styles.errorMessage}>{errors.teamName.message}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.formGroup} style={{ gridColumn: isTeam ? "1/-1" : undefined }}>
        <label className={styles.fieldLabel}>
          {isTeam ? "SQUAD LEADER NAME" : "FULL DELEGATE NAME"} <span className={styles.req}>*</span>
        </label>
        <input
          suppressHydrationWarning
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
        {errors.name && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIndicator} />
            <div className={styles.errorTextGroup}>
              <span className={styles.errorLabel}>{errors.name.code}</span>
              <span className={styles.errorMessage}>{errors.name.message}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.fieldLabel}>
          INSTITUTIONAL EMAIL <span className={styles.req}>*</span>
        </label>
        <input
          suppressHydrationWarning
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          placeholder="delegate@institution.edu.in"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        {errors.email && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIndicator} />
            <div className={styles.errorTextGroup}>
              <span className={styles.errorLabel}>{errors.email.code}</span>
              <span className={styles.errorMessage}>{errors.email.message}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.fieldLabel}>
          MOBILE PHONE NUMBER <span className={styles.req}>*</span>
        </label>
        <input
          suppressHydrationWarning
          type="tel"
          className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
        {errors.phone && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIndicator} />
            <div className={styles.errorTextGroup}>
              <span className={styles.errorLabel}>{errors.phone.code}</span>
              <span className={styles.errorMessage}>{errors.phone.message}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.fieldLabel}>
          COLLEGE / INSTITUTION <span className={styles.req}>*</span>
        </label>
        <input
          suppressHydrationWarning
          className={`${styles.input} ${errors.college ? styles.inputError : ""}`}
          placeholder="e.g. VVIIT Nambur"
          value={form.college}
          onChange={(e) => onChange("college", e.target.value)}
        />
        {errors.college && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIndicator} />
            <div className={styles.errorTextGroup}>
              <span className={styles.errorLabel}>{errors.college.code}</span>
              <span className={styles.errorMessage}>{errors.college.message}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.fieldLabel}>
          ACADEMIC YEAR <span className={styles.req}>*</span>
        </label>
        <select
          suppressHydrationWarning
          className={`${styles.select} ${errors.year ? styles.inputError : ""}`}
          value={form.year}
          onChange={(e) => onChange("year", e.target.value)}
        >
          <option value="">Select Academic Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        {errors.year && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIndicator} />
            <div className={styles.errorTextGroup}>
              <span className={styles.errorLabel}>{errors.year.code}</span>
              <span className={styles.errorMessage}>{errors.year.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepMembers({
  members,
  errors,
  onChange,
  onAdd,
  onRemove,
}: {
  members: Member[];
  errors: FormErrors;
  onChange: (i: number, f: keyof Member, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <span className={styles.kicker}>SEC: SQUAD COMPOSITION</span>
        <p className={styles.membersNote}>
          Enumerate active squad delegates (excluding lead operator). Maximum 4 members per team.
        </p>
      </div>

      {members.map((m, i) => {
        const nameErr = errors[`member_${i}_name`];
        const emailErr = errors[`member_${i}_email`];

        return (
          <div key={i} className={styles.memberBlock}>
            <div className={styles.memberHeader}>
              <span className={styles.memberNum}>SQUAD MEMBER // 0{i + 2}</span>
              {members.length > 1 && (
                <button
                  suppressHydrationWarning
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => onRemove(i)}
                  aria-label="Remove member"
                >
                  <Trash2 size={14} /> REMOVE
                </button>
              )}
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  MEMBER NAME <span className={styles.req}>*</span>
                </label>
                <input
                  suppressHydrationWarning
                  className={`${styles.input} ${nameErr ? styles.inputError : ""}`}
                  placeholder="Full name"
                  value={m.name}
                  onChange={(e) => onChange(i, "name", e.target.value)}
                />
                {nameErr && (
                  <div className={styles.errorBanner} role="alert">
                    <span className={styles.errorIndicator} />
                    <div className={styles.errorTextGroup}>
                      <span className={styles.errorLabel}>{nameErr.code}</span>
                      <span className={styles.errorMessage}>{nameErr.message}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.fieldLabel}>
                  EMAIL ADDRESS <span className={styles.req}>*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  className={`${styles.input} ${emailErr ? styles.inputError : ""}`}
                  placeholder="member@institution.edu.in"
                  value={m.email}
                  onChange={(e) => onChange(i, "email", e.target.value)}
                />
                {emailErr && (
                  <div className={styles.errorBanner} role="alert">
                    <span className={styles.errorIndicator} />
                    <div className={styles.errorTextGroup}>
                      <span className={styles.errorLabel}>{emailErr.code}</span>
                      <span className={styles.errorMessage}>{emailErr.message}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.fieldLabel}>CONTACT MOBILE (OPTIONAL)</label>
                <input
                  suppressHydrationWarning
                  type="tel"
                  className={styles.input}
                  placeholder="+91 98765 00000"
                  value={m.phone}
                  onChange={(e) => onChange(i, "phone", e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      })}

      {members.length < 4 && (
        <button
          suppressHydrationWarning
          type="button"
          className={styles.addMemberBtn}
          onClick={onAdd}
        >
          <Plus size={15} /> APPEND SQUAD MEMBER
        </button>
      )}
    </div>
  );
}

function StepConfirm({
  form,
  event,
  isTeam,
}: {
  form: FormData;
  event: Event;
  isTeam: boolean;
}) {
  return (
    <div className={styles.confirm}>
      <div className={styles.sectionHeader}>
        <span className={styles.kicker}>SEC: DOSSIER VERIFICATION</span>
        <h4 className={styles.confirmTitle}>Review Accreditation Parameters</h4>
      </div>

      <div className={styles.confirmGrid}>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>TARGET ARENA</span>
          <strong className={styles.itemVal}>{event.name}</strong>
        </div>
        {isTeam && (
          <div className={styles.confirmItem}>
            <span className={styles.itemKey}>TEAM MONIKER</span>
            <strong className={styles.itemVal}>{form.teamName}</strong>
          </div>
        )}
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>{isTeam ? "SQUAD LEADER" : "DELEGATE"}</span>
          <strong className={styles.itemVal}>{form.name}</strong>
        </div>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>COMMUNICATION EMAIL</span>
          <strong className={styles.itemVal}>{form.email}</strong>
        </div>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>TELEPHONE</span>
          <strong className={styles.itemVal}>{form.phone}</strong>
        </div>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>AFFILIATION</span>
          <strong className={styles.itemVal}>{form.college} ({form.year})</strong>
        </div>
        {isTeam && form.members.length > 0 && (
          <div className={styles.confirmItem} style={{ gridColumn: "1/-1" }}>
            <span className={styles.itemKey}>ENROLLED SQUAD OPERATORS</span>
            <strong className={styles.itemVal}>
              {form.members.map((m) => m.name || "Unnamed").join(", ")}
            </strong>
          </div>
        )}
      </div>

      <div className={styles.confirmNotice}>
        <span className={styles.noticeDot} />
        <p>
          Submitting commits this dossier to the event registry. A cryptographic ticket with QR clearance will be dispatched to <strong>{form.email}</strong>.
        </p>
      </div>
    </div>
  );
}
