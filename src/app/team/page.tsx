"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { teamMembers, teamDivisions, TeamMember } from "@/data/team";
import MemberInfoDrawer from "@/components/team/MemberInfoDrawer";
import ExploreUniverse from "@/components/team/ExploreUniverse";
import CommitteeBar from "@/components/team/CommitteeBar";
import styles from "./page.module.css";
import { ShieldAlert, ShieldCheck, Compass, List, Sparkles, ChevronRight, User } from "lucide-react";

function MemberCard({ m, onSelect }: { m: TeamMember; onSelect: (m: TeamMember) => void }) {
  const [imgError, setImgError] = useState(false);

  const slug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const imageSrc = m.image || `/team/2026/${slug}.webp`;
  const hasPhoto = Boolean(m.image) && !imgError;

  return (
    <div 
      className={styles.card}
      onClick={() => onSelect(m)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(m);
        }
      }}
      aria-label={`Inspect dossier for ${m.name}, ${m.role}`}
    >
      <span className={styles.crosshairTL} aria-hidden="true">+</span>
      <span className={styles.crosshairTR} aria-hidden="true">+</span>
      <span className={styles.crosshairBR} aria-hidden="true">+</span>

      {hasPhoto ? (
        /* Photographic Portrait */
        <div className={styles.portraitWrapper}>
          <Image
            src={imageSrc}
            alt={`Portrait photograph of ${m.name}, ${m.role} in AMEYA '26 organizing cadre`}
            fill
            className={styles.portraitImg}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className={styles.torsoGradient} />
          
          <div className={styles.portraitOverlayInfo}>
            <div className={styles.cardHud}>
              <span className={styles.hudBadge}>ID // {m.callsign}</span>
              <span className={styles.hudRole}>{m.year}</span>
            </div>
            <h3 className={styles.memberName}>{m.name}</h3>
            <p className={styles.memberRole}>{m.role}</p>
            <p className={styles.memberDept}>{m.department}</p>
            {m.bio && <p className={styles.memberBioText}>{m.bio}</p>}
          </div>
        </div>
      ) : (
        /* Engraved Technical CAD Wireframe Blueprint over Carbon Mesh */
        <div className={styles.cadContainer}>
          {/* Ghost Industrial Watermark */}
          <div className={styles.cadWatermark} aria-hidden="true">CAD // 26</div>

          {/* Top HUD Tag */}
          <div className={styles.cardHud}>
            <span className={styles.hudBadge}>SEC // {m.callsign}</span>
            <span className={styles.hudRole}>{m.clearance}</span>
          </div>

          {/* Reticle Drafting Crosshairs */}
          <div className={styles.cadReticle} aria-hidden="true">
            <div className={styles.reticleRing} />
            <div className={styles.reticleCrossH} />
            <div className={styles.reticleCrossV} />
          </div>

          {/* Main Details */}
          <div className={styles.cardBody}>
            <div className={styles.initialsPlate}>
              <span>{m.avatar}</span>
            </div>
            <div className={styles.specIndex}>
              <span>ID // {m.callsign}</span>
              <span>{m.year}</span>
            </div>
            <h3 className={styles.memberName}>{m.name}</h3>
            <p className={styles.memberRole}>{m.role}</p>
            <p className={styles.memberDept}>{m.department}</p>
            {m.bio && <p className={styles.memberBioText}>{m.bio}</p>}
          </div>
        </div>
      )}

      {/* Card Technical Foot */}
      <div className={styles.cardFoot}>
        <div className={styles.footLeft}>
          <ShieldCheck size={12} color="#e61d1d" />
          <span>IEI COUNCIL &bull; {m.callsign}</span>
        </div>
        <div className={styles.footAction}>
          <span>DOSSIER</span>
          <ChevronRight size={12} />
        </div>
      </div>

      {/* Corner Crimson Line */}
      <div className={styles.cornerTail} aria-hidden="true" />
    </div>
  );
}

export default function TeamPage() {
  const [viewMode, setViewMode] = useState<"list" | "explore">("list");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeDivisionId, setActiveDivisionId] = useState<string>("executive");

  // Track active committee section as user scrolls
  useEffect(() => {
    if (viewMode !== "list") return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const div of teamDivisions) {
        const el = document.getElementById(div.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveDivisionId(div.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewMode]);

  const handleSelectDivision = (divId: string) => {
    setActiveDivisionId(divId);
    if (viewMode === "explore") {
      setViewMode("list");
      setTimeout(() => {
        const el = document.getElementById(divId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 70);
    } else {
      const el = document.getElementById(divId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleToggleMode = () => {
    setViewMode((prev) => (prev === "list" ? "explore" : "list"));
  };

  return (
    <div className={styles.page}>
      {/* Ghost Industrial Watermark */}
      <div className="ghost-watermark">COUNCIL</div>

      {/* Interactive Mode Switcher Strip */}
      <div className={styles.modeSwitcherContainer}>
        <div className={styles.modeSwitcher}>
          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === "list" ? styles.activeModeBtn : ""}`}
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
          >
            <List size={14} />
            <span>LIST MODE</span>
          </button>

          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === "explore" ? styles.activeModeBtn : ""}`}
            onClick={() => setViewMode("explore")}
            aria-pressed={viewMode === "explore"}
          >
            <Compass size={14} />
            <span>EXPLORE UNIVERSE</span>
            <span className={styles.modeTag}>2.5D</span>
          </button>
        </div>

        <Link href="/team/explore" className={styles.fullscreenLink} title="Launch Dedicated Fullscreen Universe">
          <Sparkles size={12} />
          <span>DEDICATED EXPLORE VIEW &rarr;</span>
        </Link>
      </div>

      {viewMode === "explore" ? (
        /* Embedded Interactive Explore Universe */
        <div className={styles.exploreWrapper}>
          <ExploreUniverse isEmbedded />
        </div>
      ) : (
        /* List Mode: Structured Division Categories */
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div className={styles.header}>
            <div className="section-label">
              <ShieldAlert size={13} />
              ORGANIZING CADRE // 2026
            </div>
            <h1>
              The Engineers Behind <span className="gradient-text">Ameya &apos;26</span>
            </h1>
            <p className={styles.sub}>
              [OPERATIONS // COUNCIL]: 18 student engineers and division leads of IEI SAME driving national technical competitions across VVITU.
            </p>
          </div>

          {/* Division Sections */}
          {teamDivisions.map((div) => {
            const members = teamMembers.filter((m) => m.divisionIndex === div.index);
            if (members.length === 0) return null;

            return (
              <section key={div.id} id={div.id} className={styles.sectionBlock}>
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionPill}>{div.code}</span>
                  <div className={styles.headingTextGroup}>
                    <h2>{div.name}</h2>
                    <p className={styles.divisionSub}>{div.description}</p>
                  </div>
                </div>

                <div className={styles.grid}>
                  {members.map((m) => (
                    <MemberCard 
                      key={m.id} 
                      m={m} 
                      onSelect={(member) => setSelectedMember(member)} 
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Slide-out Technical Dossier Sidebar */}
      <MemberInfoDrawer 
        member={selectedMember} 
        onClose={() => setSelectedMember(null)} 
      />

      {/* Floating Glassmorphic Committee Dock with Sliding Hover Indicator */}
      <CommitteeBar
        divisions={teamDivisions}
        activeDivisionId={activeDivisionId}
        viewMode={viewMode}
        onToggleMode={handleToggleMode}
        onSelectDivision={handleSelectDivision}
      />
    </div>
  );
}
