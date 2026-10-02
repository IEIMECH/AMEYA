"use client";

import React, { useState, useRef } from "react";
import { FileText, Download, ExternalLink, Bus, Clock, Maximize2 } from "lucide-react";
import { BUS_SCHEDULE_CONFIG } from "@/data/transportation";
import styles from "./BusScheduleViewer.module.css";

interface BusScheduleViewerProps {
  pdfUrl?: string;
  title?: string;
  description?: string;
}

export default function BusScheduleViewer({
  pdfUrl = BUS_SCHEDULE_CONFIG.pdfUrl,
  title = BUS_SCHEDULE_CONFIG.title,
  description = BUS_SCHEDULE_CONFIG.description,
}: BusScheduleViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasPdf = Boolean(pdfUrl && pdfUrl.trim().length > 0);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fallback: open in new window
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div className={styles.container} id="bus-schedule-viewer" ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Bus className={styles.titleIcon} size={22} />
          <h2 className={styles.title}>{title}</h2>
        </div>
        <p className={styles.description}>{description}</p>
      </div>

      {!hasPdf ? (
        /* Polished Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIconBox}>
            <Clock className={styles.emptyIcon} size={30} />
          </div>
          <span className={styles.emptyBadge}>Official Transportation</span>
          <h3 className={styles.emptyTitle}>{BUS_SCHEDULE_CONFIG.emptyNotice}</h3>
          <p className={styles.emptySub}>{BUS_SCHEDULE_CONFIG.emptySubnotice}</p>
          <span className={styles.emptyHint}>
            Routes & boarding schedules will be published prior to fest registration opening.
          </span>
        </div>
      ) : (
        /* Embedded PDF Viewer with controls */
        <>
          <div className={styles.toolbar}>
            <a
              href={pdfUrl}
              download="VVIT_Bus_Routes.pdf"
              className={styles.toolbarBtn}
              title="Download Bus Schedule"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className={styles.toolbarBtn}
              title="Full-screen Viewing"
            >
              <Maximize2 size={14} />
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.toolbarBtn}
              title="Open in New Tab"
            >
              <ExternalLink size={14} />
              <span>Open in Tab</span>
            </a>
          </div>

          <div className={styles.viewerContainer}>
            <object
              data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              type="application/pdf"
              className={styles.pdfFrame}
              aria-label="College Bus Schedule PDF"
            >
              <iframe
                src={`${pdfUrl}#toolbar=1`}
                className={styles.pdfFrame}
                title="College Bus Schedule"
              >
                <div className={styles.fallbackNotice}>
                  Your browser does not support inline PDF viewing.
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fallbackLink}
                  >
                    Click here to view or download the bus schedule PDF.
                  </a>
                </div>
              </iframe>
            </object>
          </div>

          <div className={styles.fallbackNotice}>
            Having trouble viewing the embedded document?
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fallbackLink}
            >
              Open the schedule in a new tab or download it directly.
            </a>
          </div>
        </>
      )}
    </div>
  );
}
