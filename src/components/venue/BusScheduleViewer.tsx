"use client";

import React, { useRef } from "react";
import { Bus, Clock } from "lucide-react";
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
  const hasPdf = Boolean(pdfUrl && pdfUrl.trim().length > 0);

  return (
    <div
      className={styles.container}
      id="bus-schedule-viewer"
      ref={containerRef}
    >
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
        </div>
      ) : (
        /* Pure PDF Document Presentation - No extra toolbars or clutter */
        <div className={styles.viewerContainer}>
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            type="application/pdf"
            className={styles.pdfFrame}
            aria-label="College Bus Schedule PDF"
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              className={styles.pdfFrame}
              title="College Bus Schedule"
            />
          </object>
        </div>
      )}
    </div>
  );
}
