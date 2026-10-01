"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./FestivalStory.module.css";

export default function FestivalStory() {
  const [showFullStory, setShowFullStory] = useState(false);

  return (
    <section className={styles.section} id="intro">
      <div className={styles.innerContainer}>
        {/* Editorial Headline & Story */}
        <div className={styles.editorialGrid}>
          <div className={styles.headlineColumn}>
            <h2 className={styles.monumentalHeadline}>
              <span>AMEYA IS NOT</span>
              <span>JUST ANOTHER</span>
              <span className={styles.highlightText}>TECHNICAL FEST.</span>
            </h2>
          </div>

          <div className={styles.copyColumn}>
            <p className={styles.leadParagraph}>
              It is a proving ground where theoretical continuum mechanics meets the physical reality of precision machining, robotics, and design.
              Founded under the Institution of Engineers India (SAME), the Sanskrit word <em>Ameya</em> translates
              to <strong>&ldquo;immeasurable&rdquo;</strong> &mdash; honoring the boundless potential and creative discipline of young engineers.
            </p>

            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={() => setShowFullStory(!showFullStory)}
                className={styles.revealStoryBtn}
                aria-expanded={showFullStory}
              >
                <span>{showFullStory ? "CONCISE VIEW" : "READ COMPLETE FESTIVAL ARCHIVE"}</span>
                {showFullStory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <Link href="/about" className={styles.inlineArchiveLink}>
                <span>ABOUT IEI SAME</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {showFullStory && (
              <div className={styles.expandedStoryBlock}>
                <p>
                  Held annually at Vasireddy Venkatadri Institute of Technology (VVITU), Ameya brings together collegiate engineers from across India.
                  Across two days of intense competition, participants test their mastery through parametric CAD challenges, high-speed kinematic teardowns, obstacle racecourses, and technical diagnostics.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
