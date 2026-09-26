/**
 * AMEYA '26 Analytics Event Architecture (Item 18)
 * Standardized event taxonomy respecting privacy consent.
 */

export type AmeyaEvent =
  | "EVENT_VIEW"
  | "EVENT_FILTER"
  | "REGISTER_CLICK"
  | "REGISTRATION_START"
  | "REGISTRATION_COMPLETE"
  | "AGENDA_VIEW"
  | "VENUE_MAP_INTERACTION"
  | "TEAM_MEMBER_VIEW"
  | "CONTACT_CLICK"
  | "DOCUMENT_DOWNLOAD";

export interface EventProperties {
  eventName?: string;
  category?: string;
  ticketTier?: string;
  memberCallsign?: string;
  venueZone?: string;
  channel?: string;
  [key: string]: unknown;
}

export function trackEvent(event: AmeyaEvent, properties: EventProperties = {}): void {
  if (typeof window === "undefined") return;

  // Respect user privacy consent
  const consent = localStorage.getItem("ameya:privacy-consent");
  if (consent === "rejected") {
    return;
  }

  const payload = {
    event,
    properties,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };

  // Dispatch custom event for extensible client telemetry
  window.dispatchEvent(new CustomEvent("ameya:telemetry", { detail: payload }));

  // In development, log clean telemetry handshake
  if (process.env.NODE_ENV === "development") {
    console.debug(`[AMEYA TELEMETRY] ${event}`, properties);
  }
}
