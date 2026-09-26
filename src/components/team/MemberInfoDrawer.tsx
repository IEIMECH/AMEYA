"use client";

import { useEffect } from "react";
import Image from "next/image";
import { TeamMember } from "@/data/team";
import styles from "./MemberInfoDrawer.module.css";
import { X, ExternalLink, Mail, ShieldCheck, Terminal, Compass } from "lucide-react";

function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

interface MemberInfoDrawerProps {
  member: TeamMember | null;
  onClose: () => void;
}

export default function MemberInfoDrawer({ member, onClose }: MemberInfoDrawerProps) {
  useEffect(() => {
    if (!member) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <>
      {/* Frosted Dark Backdrop Overlay */}
      <div 
        className={styles.overlay} 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Slide-out Technical Dossier Sidebar */}
      <aside 
        className={styles.drawer} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="member-dossier-name"
      >
        {/* Header HUD Strip */}
        <div className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.divisionBadge}>
              <Terminal size={11} className={styles.badgeIcon} />
              {member.division.toUpperCase()}
            </span>
            <span className={styles.clearanceTag}>
              {member.clearance}
            </span>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className={styles.closeBtn}
            aria-label="Close dossier"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Dossier Body */}
        <div className={styles.body}>
          {/* Avatar / Mechanical Reticle Showcase */}
          <div className={styles.avatarShowcase}>
            <div className={styles.reticleContainer}>
              {/* Rotating Mechanical Reticle Rings */}
              <div className={styles.reticleRingOuter} aria-hidden="true" />
              <div className={styles.reticleRingInner} aria-hidden="true" />
              <div className={styles.crosshairH} aria-hidden="true" />
              <div className={styles.crosshairV} aria-hidden="true" />

              {/* Core Avatar Image or Carbon Initials Emblem */}
              <div className={styles.avatarCore}>
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`Detailed dossier portrait of ${member.name}, ${member.role}`}
                    width={140}
                    height={140}
                    className={styles.avatarImg}
                  />
                ) : (
                  <div className={styles.initialsPlate}>
                    <span className={styles.initialsText}>{member.avatar}</span>
                    <span className={styles.callsignSub}>{member.callsign}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cadWatermark} aria-hidden="true">
              SEC // CADRE-{String(member.id).padStart(2, "0")}
            </div>
          </div>

          {/* Member Identity & Rank */}
          <div className={styles.identityBlock}>
            <div className={styles.statusChip}>
              <span className={styles.statusPulse} />
              <span>ACTIVE CADRE // IEI COUNCIL</span>
            </div>

            <h2 id="member-dossier-name" className={styles.memberName}>
              {member.name}
            </h2>

            <div className={styles.roleLine}>
              <span className={styles.roleTitle}>{member.role}</span>
              <span className={styles.deptSub}>{member.department} &bull; {member.year}</span>
            </div>
          </div>

          {/* Mission Quote / Bio Statement */}
          <div className={styles.quoteBlock}>
            <div className={styles.quoteAccent} aria-hidden="true" />
            <p className={styles.quoteText}>
              &ldquo;{member.bio}&rdquo;
            </p>
          </div>

          {/* Engineering Specifications Grid */}
          <div className={styles.specSection}>
            <div className={styles.specHeading}>
              <Compass size={13} color="#e61d1d" />
              <span>TELEMETRY &amp; SPECIALIZATION</span>
            </div>

            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>CHASSIS ID</span>
                <span className={styles.specValue}>AMEYA-ENG-{String(member.id).padStart(3, "0")}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>CALLSIGN</span>
                <span className={styles.specValue}>{member.callsign}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>SECURITY CLEARANCE</span>
                <span className={styles.specValue}>{member.clearance}</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specLabel}>COUNCIL SECTOR</span>
                <span className={styles.specValue}>{member.division}</span>
              </div>
              <div className={styles.specItemFull}>
                <span className={styles.specLabel}>PRIMARY SPECIALIZATION</span>
                <span className={styles.specValueHighlight}>{member.specialization}</span>
              </div>
            </div>
          </div>

          {/* Communications & Uplinks */}
          <div className={styles.commSection}>
            <div className={styles.specHeading}>
              <ShieldCheck size={13} color="#e61d1d" />
              <span>COMMUNICATION UPLINKS</span>
            </div>

            <div className={styles.socialButtons}>
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.commBtn}
                >
                  <LinkedinIcon size={15} />
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={12} className={styles.btnArrow} />
                </a>
              )}

              {member.socials.github && (
                <a
                  href={member.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.commBtn}
                >
                  <GithubIcon size={15} />
                  <span>GitHub Repositories</span>
                  <ExternalLink size={12} className={styles.btnArrow} />
                </a>
              )}

              {member.socials.email && (
                <a
                  href={`mailto:${member.socials.email}`}
                  className={styles.commBtn}
                >
                  <Mail size={15} />
                  <span>Send Direct Comm</span>
                  <ExternalLink size={12} className={styles.btnArrow} />
                </a>
              )}

              {member.socials.portfolio && (
                <a
                  href={member.socials.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.commBtn}
                >
                  <ExternalLink size={15} />
                  <span>Personal Portfolio</span>
                  <ExternalLink size={12} className={styles.btnArrow} />
                </a>
              )}

              {!member.socials.linkedin && !member.socials.github && !member.socials.email && !member.socials.portfolio && (
                <div className={styles.commNotice}>
                  [Comm channel routed through IEI Central Council Secretariat]
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer HUD Coordinates */}
        <div className={styles.footer}>
          <span>AMEYA-CADRE // VERIFIED</span>
          <span className={styles.footerCoord}>
            X: {member.exploreCoords.x} &bull; Y: {member.exploreCoords.y}
          </span>
        </div>
      </aside>
    </>
  );
}
