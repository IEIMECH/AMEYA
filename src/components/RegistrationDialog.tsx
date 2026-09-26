"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, ChevronLeft, CheckCircle, Loader2, Plus, Trash2, ShieldCheck, Ticket } from "lucide-react";
import type { Event } from "@/data/events";
import styles from "./RegistrationDialog.module.css";

interface Member {
  name: string;
  email: string;
  phone: string;
}

interface FormData {
  // Common / Delegate / Lead
  name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  teamName: string;
  members: Member[];

  // HackSprint
  domainTrack: string;
  projectTitle: string;
  proposalSynopsis: string;
  hardwareRequirements: string;

  // Tech Manuscript (Paper)
  paperTitle: string;
  researchTrack: string;
  abstractText: string;
  driveLink: string;

  // CAD Clash
  softwarePreference: string;
  experienceLevel: string;
  bringingOwnLaptop: boolean;

  // Robo Rumble
  botName: string;
  weightCategory: string;
  driveSystem: string;
  weaponMechanism: string;
  frequencyBand: string;

  // Circuit Breaker
  preferredController: string;
  labExperience: string;

  // Photography
  deviceType: string;
  cameraModel: string;
  portfolioLink: string;

  // Debate
  topicPreference: string;
  priorDebateExperience: string;

  // Gear Hunt
  emergencyContact: string;

  // Fest Visitor Pass
  attendingDays: string;
  areasOfInterest: string[];
  purposeOfVisit: string;
}

interface FieldError {
  code: string;
  message: string;
}

type FormErrors = Partial<Record<string, FieldError>>;

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate / Alumni"];

function initForm(): FormData {
  return {
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    teamName: "",
    members: [{ name: "", email: "", phone: "" }],

    domainTrack: "Automation & Robotics",
    projectTitle: "",
    proposalSynopsis: "",
    hardwareRequirements: "",

    paperTitle: "",
    researchTrack: "Machine Design & Dynamics",
    abstractText: "",
    driveLink: "",

    softwarePreference: "SolidWorks",
    experienceLevel: "Intermediate",
    bringingOwnLaptop: true,

    botName: "",
    weightCategory: "Featherweight <15kg",
    driveSystem: "4WD",
    weaponMechanism: "Spinner",
    frequencyBand: "2.4GHz Spread Spectrum",

    preferredController: "Arduino / AVR",
    labExperience: "Academic Coursework",

    deviceType: "DSLR / Mirrorless",
    cameraModel: "",
    portfolioLink: "",

    topicPreference: "Autonomous Manufacturing & AI",
    priorDebateExperience: "First Time",

    emergencyContact: "",

    attendingDays: "Both Days (Oct 04–05)",
    areasOfInterest: ["Keynote Lectures", "Robotics Arena Spectator", "Project Expo"],
    purposeOfVisit: "",
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

  const isVisitor = event?.id === "visitor-pass" || event?.id === "visitor";
  const isTeam = event?.type === "team" && !isVisitor;

  const STEPS = isVisitor
    ? ["Visitor Info", "Visit Schedule & Interests", "Confirm & Issue Pass"]
    : isTeam
    ? ["Cadre Lead", "Squad Members", "Arena Specifications", "Confirm & Transmit"]
    : ["Delegate Info", "Arena Specifications", "Confirm & Transmit"];

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

  function validateStep(currentStepIndex: number): boolean {
    const newErrors: FormErrors = {};

    // STEP 0: Base Delegate / Lead info
    if (currentStepIndex === 0) {
      if (isTeam && !form.teamName.trim()) {
        newErrors.teamName = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please specify your official engineering team designation.",
        };
      }
      if (!form.name.trim()) {
        newErrors.name = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: isVisitor ? "Please enter your full name." : "Please enter your full delegate name.",
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
          message: "Please enter a valid email address.",
        };
      }
      if (!form.phone.trim()) {
        newErrors.phone = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please enter your mobile phone number.",
        };
      } else if (!validatePhone(form.phone)) {
        newErrors.phone = {
          code: "INPUT ERROR // INVALID PHONE",
          message: "Please enter a valid 10-digit mobile number.",
        };
      }
      if (!isVisitor && !form.college.trim()) {
        newErrors.college = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "College or institutional affiliation is required.",
        };
      }
      if (!isVisitor && !form.year) {
        newErrors.year = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Select your current academic year of study.",
        };
      }
    }

    // STEP 1 for Team: Validate Squad Members
    if (isTeam && currentStepIndex === 1) {
      form.members.forEach((m, idx) => {
        if (!m.name.trim()) {
          newErrors[`member_${idx}_name`] = {
            code: "INPUT ERROR // REQUIRED FIELD EMPTY",
            message: `Member 0${idx + 2} name is required.`,
          };
        }
        if (!m.email.trim()) {
          newErrors[`member_${idx}_email`] = {
            code: "INPUT ERROR // REQUIRED FIELD EMPTY",
            message: `Member 0${idx + 2} email is required.`,
          };
        } else if (!validateEmail(m.email)) {
          newErrors[`member_${idx}_email`] = {
            code: "INPUT ERROR // INVALID EMAIL",
            message: `Member 0${idx + 2} email address is invalid.`,
          };
        }
      });
    }

    // Specific Arena or Visitor Specs Step
    const specsStepIndex = isVisitor ? 1 : isTeam ? 2 : 1;
    if (currentStepIndex === specsStepIndex) {
      if (event?.id === "hackathon" && !form.projectTitle.trim()) {
        newErrors.projectTitle = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please provide a provisional title or prototype concept name.",
        };
      }
      if (event?.id === "paper-presentation" && !form.paperTitle.trim()) {
        newErrors.paperTitle = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please specify your research manuscript title.",
        };
      }
      if (event?.id === "robo-race" && !form.botName.trim()) {
        newErrors.botName = {
          code: "INPUT ERROR // REQUIRED FIELD EMPTY",
          message: "Please provide your robot's combat moniker / chassis name.",
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  }

  function updateField<K extends keyof FormData>(field: K, val: FormData[K]) {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
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
      type: isVisitor ? "Fest Visitor" : isTeam ? "Team Leader" : "Individual Delegate",
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
            <span className={styles.kicker}>
              {isVisitor ? "SYS: VISITOR PASS // PROTOCOL" : "SYS: REGISTRATION // PROTOCOL"}
            </span>
            <span className={styles.eventName}>{event.name}</span>
            <span className={styles.eventType}>
              {isVisitor
                ? "CAMPUS VISITOR PASS"
                : event.type === "team"
                ? `SQUAD CADRE · ${event.teamSize || "2-4"}`
                : "SOLO OPERATOR"}
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
                <div className={styles.successKicker}>
                  {isVisitor ? "PROTOCOL // VISITOR CLEARANCE GRANTED" : "PROTOCOL // HANDSHAKE CONFIRMED"}
                </div>
                <h3 className={styles.successTitle}>
                  {isVisitor ? "Visitor Pass Issued." : "Registration Confirmed."}
                </h3>
                <p className={styles.successDesc}>
                  Your accreditation docket for <strong>{event.name}</strong> has been committed to the AMEYA &apos;26 database.
                </p>
              </div>

              <div className={styles.docketSummary}>
                <div className={styles.docketRow}>
                  <span className={styles.docketLabel}>TICKET TOKEN</span>
                  <code className={styles.docketVal}>{ticketId}</code>
                </div>
                <div className={styles.docketRow}>
                  <span className={styles.docketLabel}>{isVisitor ? "VISITOR" : "DELEGATE"}</span>
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
                  The upstream registry could not persist your registration docket. Your inputs have been preserved. Please retry transmission.
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
              {/* STEP 0: Lead or Delegate Information */}
              {step === 0 && (
                <StepLeaderInfo
                  form={form}
                  isTeam={isTeam}
                  isVisitor={isVisitor}
                  errors={errors}
                  onChange={updateField}
                />
              )}

              {/* STEP 1 (Team Only): Squad Members */}
              {isTeam && step === 1 && (
                <StepMembers
                  members={form.members}
                  errors={errors}
                  onChange={updateMember}
                  onAdd={addMember}
                  onRemove={removeMember}
                />
              )}

              {/* ARENA SPECIFICATIONS STEP */}
              {((isTeam && step === 2) || (!isTeam && step === 1)) && (
                <StepArenaSpecs
                  eventId={event.id}
                  form={form}
                  errors={errors}
                  onChange={updateField}
                />
              )}

              {/* FINAL CONFIRM STEP */}
              {step === totalSteps - 1 && (
                <StepConfirm form={form} event={event} isTeam={isTeam} isVisitor={isVisitor} />
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
                ) : isVisitor ? (
                  "CONFIRM & ISSUE VISITOR PASS"
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

// -----------------------------------------------------------------------------
// SUBCOMPONENT: Step 0 (Leader / Delegate Base Information)
// -----------------------------------------------------------------------------
function StepLeaderInfo({
  form,
  isTeam,
  isVisitor,
  errors,
  onChange,
}: {
  form: FormData;
  isTeam: boolean;
  isVisitor: boolean;
  errors: FormErrors;
  onChange: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
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

      <div className={styles.formGroup} style={{ gridColumn: isTeam || isVisitor ? "1/-1" : undefined }}>
        <label className={styles.fieldLabel}>
          {isVisitor ? "VISITOR FULL NAME" : isTeam ? "SQUAD LEADER NAME" : "FULL DELEGATE NAME"}{" "}
          <span className={styles.req}>*</span>
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
          EMAIL ADDRESS <span className={styles.req}>*</span>
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
          COLLEGE / INSTITUTION {!isVisitor && <span className={styles.req}>*</span>}
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
          YEAR OF STUDY {!isVisitor && <span className={styles.req}>*</span>}
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

// -----------------------------------------------------------------------------
// SUBCOMPONENT: Step 1 (Squad Members for Team Events)
// -----------------------------------------------------------------------------
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
          Enumerate active squad delegates (excluding lead operator). Maximum 4 members per squad.
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
            </div>
          </div>
        );
      })}

      {members.length < 3 && (
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

// -----------------------------------------------------------------------------
// SUBCOMPONENT: Event-Specific Specifications / Visitor Details
// -----------------------------------------------------------------------------
function StepArenaSpecs({
  eventId,
  form,
  errors,
  onChange,
}: {
  eventId: string;
  form: FormData;
  errors: FormErrors;
  onChange: <K extends keyof FormData>(f: K, v: FormData[K]) => void;
}) {
  if (eventId === "visitor-pass" || eventId === "visitor") {
    return (
      <div className={styles.formGrid}>
        <div className={styles.sectionHeader} style={{ gridColumn: "1/-1" }}>
          <span className={styles.kicker}>SEC: VISITOR INTENT & SCHEDULE</span>
          <p className={styles.membersNote}>
            General visitor passes allow campus access to observe competitions, keynote talks, and project exhibitions.
          </p>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>ATTENDING DATES</label>
          <select
            className={styles.select}
            value={form.attendingDays}
            onChange={(e) => onChange("attendingDays", e.target.value)}
          >
            <option value="Both Days (Oct 04–05)">Both Days (Oct 04 & 05, 2026)</option>
            <option value="Day 1 Only (Oct 04)">Day 1 Only — Prototyping & Keynotes (Oct 04)</option>
            <option value="Day 2 Only (Oct 05)">Day 2 Only — RoboWars & Grand Finale (Oct 05)</option>
          </select>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>PURPOSE OF VISIT / PRIMARY INTEREST</label>
          <textarea
            className={styles.textarea}
            rows={3}
            placeholder="e.g. Attending keynote lectures, exploring mechanical robotics displays, networking with student innovators..."
            value={form.purposeOfVisit}
            onChange={(e) => onChange("purposeOfVisit", e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (eventId === "hackathon") {
    return (
      <div className={styles.formGrid}>
        <div className={styles.sectionHeader} style={{ gridColumn: "1/-1" }}>
          <span className={styles.kicker}>SEC: HACKSPRINT 24H SPECIFICATIONS</span>
          <p className={styles.membersNote}>Prototyping domain track and initial design concept.</p>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>DOMAIN TRACK</label>
          <select
            className={styles.select}
            value={form.domainTrack}
            onChange={(e) => onChange("domainTrack", e.target.value)}
          >
            <option value="Automation & Robotics">Automation & Kinematic Robotics</option>
            <option value="Clean Tech & Energy">Clean Tech, Energy & Battery Systems</option>
            <option value="Smart Manufacturing">Smart Manufacturing & Industry 4.0</option>
            <option value="Open Mechanical Innovation">Open Mechanical Innovation</option>
          </select>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>PROVISIONAL PROJECT TITLE <span className={styles.req}>*</span></label>
          <input
            className={`${styles.input} ${errors.projectTitle ? styles.inputError : ""}`}
            placeholder="e.g. Autonomous Solar Tracking Gimbal"
            value={form.projectTitle}
            onChange={(e) => onChange("projectTitle", e.target.value)}
          />
          {errors.projectTitle && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIndicator} />
              <div className={styles.errorTextGroup}>
                <span className={styles.errorLabel}>{errors.projectTitle.code}</span>
                <span className={styles.errorMessage}>{errors.projectTitle.message}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>BRIEF HARDWARE/SOFTWARE SYNOPSIS</label>
          <textarea
            className={styles.textarea}
            rows={3}
            placeholder="Describe the problem, proposed mechanical mechanism, and target prototype output..."
            value={form.proposalSynopsis}
            onChange={(e) => onChange("proposalSynopsis", e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (eventId === "paper-presentation") {
    return (
      <div className={styles.formGrid}>
        <div className={styles.sectionHeader} style={{ gridColumn: "1/-1" }}>
          <span className={styles.kicker}>SEC: RESEARCH MANUSCRIPT SPECIFICATIONS</span>
          <p className={styles.membersNote}>Peer-reviewed mechanical engineering paper presentation docket.</p>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>RESEARCH TRACK</label>
          <select
            className={styles.select}
            value={form.researchTrack}
            onChange={(e) => onChange("researchTrack", e.target.value)}
          >
            <option value="Machine Design & Dynamics">Machine Design, Vibrations & Dynamics</option>
            <option value="Thermal & Fluid Sciences">Thermal, CFD & Fluid Sciences</option>
            <option value="Materials & Additive Manufacturing">Materials & Additive Manufacturing</option>
            <option value="Mechatronics & Robotics">Mechatronics & Autonomous Systems</option>
          </select>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>RESEARCH PAPER TITLE <span className={styles.req}>*</span></label>
          <input
            className={`${styles.input} ${errors.paperTitle ? styles.inputError : ""}`}
            placeholder="e.g. Topology Optimization of Aerospike Nozzle Geometry"
            value={form.paperTitle}
            onChange={(e) => onChange("paperTitle", e.target.value)}
          />
          {errors.paperTitle && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIndicator} />
              <div className={styles.errorTextGroup}>
                <span className={styles.errorLabel}>{errors.paperTitle.code}</span>
                <span className={styles.errorMessage}>{errors.paperTitle.message}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>MANUSCRIPT DRIVE / DROPBOX LINK</label>
          <input
            className={styles.input}
            placeholder="https://drive.google.com/file/d/..."
            value={form.driveLink}
            onChange={(e) => onChange("driveLink", e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (eventId === "cad-design") {
    return (
      <div className={styles.formGrid}>
        <div className={styles.sectionHeader} style={{ gridColumn: "1/-1" }}>
          <span className={styles.kicker}>SEC: CAD CLASH SPEED MODELING</span>
          <p className={styles.membersNote}>Select your CAD design environment and skill tier.</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>PREFERRED CAD SUITE</label>
          <select
            className={styles.select}
            value={form.softwarePreference}
            onChange={(e) => onChange("softwarePreference", e.target.value)}
          >
            <option value="SolidWorks">Dassault SolidWorks</option>
            <option value="Autodesk Inventor">Autodesk Inventor</option>
            <option value="Autodesk Fusion 360">Autodesk Fusion 360</option>
            <option value="CATIA V5">Dassault CATIA</option>
            <option value="PTC Creo">PTC Creo Parametric</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>EXPERIENCE LEVEL</label>
          <select
            className={styles.select}
            value={form.experienceLevel}
            onChange={(e) => onChange("experienceLevel", e.target.value)}
          >
            <option value="Intermediate">Intermediate (Assemblies & Mates)</option>
            <option value="Advanced">Advanced (Surfacing & GD&T)</option>
            <option value="Beginner">Beginner / Student</option>
          </select>
        </div>
      </div>
    );
  }

  if (eventId === "robo-race") {
    return (
      <div className={styles.formGrid}>
        <div className={styles.sectionHeader} style={{ gridColumn: "1/-1" }}>
          <span className={styles.kicker}>SEC: ROBO RUMBLE TELEMETRY</span>
          <p className={styles.membersNote}>Mechanical chassis, weight compliance, and weapon mechanics.</p>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>BOT MONIKER / CHASSIS NAME <span className={styles.req}>*</span></label>
          <input
            className={`${styles.input} ${errors.botName ? styles.inputError : ""}`}
            placeholder="e.g. Titan Crusher"
            value={form.botName}
            onChange={(e) => onChange("botName", e.target.value)}
          />
          {errors.botName && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorIndicator} />
              <div className={styles.errorTextGroup}>
                <span className={styles.errorLabel}>{errors.botName.code}</span>
                <span className={styles.errorMessage}>{errors.botName.message}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>WEIGHT CLASS</label>
          <select
            className={styles.select}
            value={form.weightCategory}
            onChange={(e) => onChange("weightCategory", e.target.value)}
          >
            <option value="Featherweight <15kg">Featherweight (&lt; 15kg)</option>
            <option value="Mini <5kg">Mini / Beetleweight (&lt; 5kg)</option>
            <option value="Open Category">Open Weight Category</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.fieldLabel}>WEAPON ARCHITECTURE</label>
          <select
            className={styles.select}
            value={form.weaponMechanism}
            onChange={(e) => onChange("weaponMechanism", e.target.value)}
          >
            <option value="Vertical Drum Spinner">Vertical Drum Spinner</option>
            <option value="Horizontal Disc Spinner">Horizontal Disc Spinner</option>
            <option value="Pneumatic Flipper / Lifter">Pneumatic Flipper / Lifter</option>
            <option value="Combat Wedge / Rammer">Combat Wedge / Rammer</option>
            <option value="None / Speed Racer">None (Speed Racer Config)</option>
          </select>
        </div>
      </div>
    );
  }

  // Generic specifications for quiz, circuit, debate, photography, gear hunt
  return (
    <div className={styles.formGrid}>
      <div className={styles.sectionHeader} style={{ gridColumn: "1/-1" }}>
        <span className={styles.kicker}>SEC: ARENA PARAMETERS</span>
        <p className={styles.membersNote}>Additional technical configuration for this competition.</p>
      </div>

      {eventId === "circuit-debug" && (
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>PREFERRED CONTROLLER / ARCHITECTURE</label>
          <select
            className={styles.select}
            value={form.preferredController}
            onChange={(e) => onChange("preferredController", e.target.value)}
          >
            <option value="Arduino / AVR">Arduino / ATmega / AVR</option>
            <option value="STM32 ARM Cortex">STM32 ARM Cortex</option>
            <option value="ESP32 / IoT">ESP32 Mechatronic Node</option>
            <option value="PLC Ladder Logic">PLC Ladder Logic & Relays</option>
          </select>
        </div>
      )}

      {eventId === "photography" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>PRIMARY GEAR</label>
            <select
              className={styles.select}
              value={form.deviceType}
              onChange={(e) => onChange("deviceType", e.target.value)}
            >
              <option value="DSLR / Mirrorless">DSLR / Mirrorless Camera</option>
              <option value="Mobile Camera">Mobile High-Res Sensor</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>PORTFOLIO / INSTAGRAM</label>
            <input
              className={styles.input}
              placeholder="@handle or portfolio link"
              value={form.portfolioLink}
              onChange={(e) => onChange("portfolioLink", e.target.value)}
            />
          </div>
        </>
      )}

      {eventId === "debate" && (
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>TOPIC PREFERENCE</label>
          <select
            className={styles.select}
            value={form.topicPreference}
            onChange={(e) => onChange("topicPreference", e.target.value)}
          >
            <option value="Autonomous Manufacturing & AI">Autonomous Manufacturing & AI Ethics</option>
            <option value="Green Hydrogen vs Solid-State EV">Green Hydrogen vs Solid-State EV</option>
            <option value="Supersonic Space Logistics">Deep Space Manufacturing & Robotics</option>
          </select>
        </div>
      )}

      {eventId === "treasure-hunt" && (
        <div className={styles.formGroup} style={{ gridColumn: "1/-1" }}>
          <label className={styles.fieldLabel}>EMERGENCY CONTACT PHONE</label>
          <input
            className={styles.input}
            placeholder="+91 00000 00000"
            value={form.emergencyContact}
            onChange={(e) => onChange("emergencyContact", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// SUBCOMPONENT: Final Step (Verification & Confirm)
// -----------------------------------------------------------------------------
function StepConfirm({
  form,
  event,
  isTeam,
  isVisitor,
}: {
  form: FormData;
  event: Event;
  isTeam: boolean;
  isVisitor: boolean;
}) {
  return (
    <div className={styles.confirm}>
      <div className={styles.sectionHeader}>
        <span className={styles.kicker}>SEC: DOSSIER VERIFICATION</span>
        <h4 className={styles.confirmTitle}>Review Accreditation Parameters</h4>
      </div>

      <div className={styles.confirmGrid}>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>ENTRY TYPE</span>
          <strong className={styles.itemVal}>{event.name}</strong>
        </div>
        {isTeam && (
          <div className={styles.confirmItem}>
            <span className={styles.itemKey}>SQUAD MONIKER</span>
            <strong className={styles.itemVal}>{form.teamName}</strong>
          </div>
        )}
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>{isVisitor ? "VISITOR" : isTeam ? "SQUAD LEADER" : "DELEGATE"}</span>
          <strong className={styles.itemVal}>{form.name}</strong>
        </div>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>EMAIL</span>
          <strong className={styles.itemVal}>{form.email}</strong>
        </div>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>TELEPHONE</span>
          <strong className={styles.itemVal}>{form.phone}</strong>
        </div>
        <div className={styles.confirmItem}>
          <span className={styles.itemKey}>AFFILIATION</span>
          <strong className={styles.itemVal}>{form.college || "General Delegate"} {form.year ? `(${form.year})` : ""}</strong>
        </div>
      </div>

      <div className={styles.confirmNotice}>
        <span className={styles.noticeDot} />
        <p>
          Submitting commits this dossier to the festival database. A cryptographic ticket token with QR clearance will be dispatched to <strong>{form.email}</strong>.
        </p>
      </div>
    </div>
  );
}
