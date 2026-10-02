"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Users,
  ChevronLeft,
  Calendar,
  Layers,
  Download,
  Plus,
  LogOut,
  Archive,
  RotateCcw,
  X,
  ShieldCheck,
  Check,
  RefreshCw,
  ExternalLink,
  Eye,
  Radio,
} from "lucide-react";
import styles from "./admin.module.css";

interface Attendee {
  id: string;
  ticket_id: string;
  event_id: string;
  event_name: string;
  event_day: number;
  participant_name: string;
  email: string;
  phone: string;
  college_roll_number: string;
  branch: string;
  college: string;
  year?: string;
  status: "Approved" | "Pending" | "Rejected";
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  avatar_color: string;
}

interface EventItem {
  id: string;
  name: string;
  tagline?: string;
  category: "Technical" | "Non-technical";
  day: 1 | 2;
  venue?: string;
  time?: string;
  registered_count?: number;
  checked_in_count?: number;
  is_archived?: boolean;
}

export default function AdminPortalPage() {
  const router = useRouter();

  // Authentication & Active Admin State
  const [currentAdmin, setCurrentAdmin] = useState({
    name: "Operations Administrator",
    role: "Lead Administrator",
    username: "admin",
    avatarColor: "#e51d25",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"applicants" | "events">("applicants");
  const [eventViewFilter, setEventViewFilter] = useState<"all" | "active" | "archived">("all");

  // Data State (Directly from Supabase & Dynamic Events)
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Grouped Filters: Search -> Event -> Attendance -> Status
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedAttendance, setSelectedAttendance] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Selection & Bulk Actions
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketModal, setSelectedTicketModal] = useState<Attendee | null>(null);

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    name: "",
    tagline: "",
    category: "Technical" as "Technical" | "Non-technical",
    day: 1 as 1 | 2,
    venue: "Main Mech Arena",
    time: "10:00 AM - 01:00 PM",
    description: "",
  });

  // Verify auth session on mount with strict redirect
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentAdmin(data.user);
            fetchData();
          } else {
            router.push("/admin/login");
          }
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  async function fetchData() {
    setLoading(true);
    try {
      const [attRes, evtRes] = await Promise.all([
        fetch("/api/admin/attendees"),
        fetch("/api/admin/events"),
      ]);

      if (attRes.status === 401 || evtRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (attRes.ok) {
        const attData = await attRes.json();
        setAttendees(attData.attendees || []);
      }
      if (evtRes.ok) {
        const evtData = await evtRes.json();
        setEvents(evtData.events || []);
      }
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setLoading(false);
    }
  }

  // Toggle single attendance directly into Supabase
  const handleToggleAttendance = async (attendee: Attendee) => {
    try {
      const res = await fetch("/api/admin/attendees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: attendee.ticket_id,
          coordinator: currentAdmin.name,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.attendee) {
        setAttendees((prev) =>
          prev.map((a) => (a.ticket_id === attendee.ticket_id ? data.attendee : a))
        );
        triggerNotice(
          data.attendee.verified_at
            ? `Checked in: ${attendee.participant_name}`
            : `Reset attendance for: ${attendee.participant_name}`,
          "success"
        );
      }
    } catch {
      triggerNotice("Error updating attendance in Supabase", "error");
    }
  };

  // Bulk Operations
  const handleBulkAttendance = async (markPresent: boolean) => {
    if (selectedTickets.size === 0) return;
    try {
      const res = await fetch("/api/admin/attendees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: markPresent ? "mark_present" : "mark_absent",
          ticketIds: Array.from(selectedTickets),
          coordinator: currentAdmin.name,
        }),
      });

      if (res.ok) {
        fetchData();
        setSelectedTickets(new Set());
        triggerNotice(
          markPresent
            ? `Marked ${selectedTickets.size} delegates present in Supabase.`
            : `Reset attendance for ${selectedTickets.size} delegates.`,
          "success"
        );
      }
    } catch {
      triggerNotice("Failed bulk update.", "error");
    }
  };

  // Export CSV of filtered or selected applicants
  const handleExportCSV = (onlySelected = false) => {
    const targetList =
      onlySelected && selectedTickets.size > 0
        ? filteredAttendees.filter((a) => selectedTickets.has(a.ticket_id))
        : filteredAttendees;

    const headers = [
      "Ticket ID",
      "Participant Name",
      "College Roll Number / Team ID",
      "Branch / Team Name",
      "College",
      "Event Registered",
      "Email Address",
      "Phone Number",
      "Application Status",
      "Check-In Status",
      "Check-In Timestamp",
      "Verified By Coordinator",
      "Registration Date",
    ];

    const rows = targetList.map((a) => [
      `"${a.ticket_id}"`,
      `"${a.participant_name}"`,
      `"${a.college_roll_number}"`,
      `"${a.branch}"`,
      `"${a.college}"`,
      `"${a.event_name}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.status}"`,
      `"${a.verified_at ? "PRESENT" : "ABSENT"}"`,
      `"${a.verified_at || ""}"`,
      `"${a.verified_by || ""}"`,
      `"${a.created_at}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AMEYA26_Attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Event Handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name) return;

    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        fetchData();
        setShowCreateModal(false);
        setNewEvent({
          name: "",
          tagline: "",
          category: "Technical",
          day: 1,
          venue: "Main Mech Arena",
          time: "10:00 AM - 01:00 PM",
          description: "",
        });
        triggerNotice(`Created new event '${newEvent.name}'. It is now live on the public website!`, "success");
      }
    } catch {
      triggerNotice("Failed to create event", "error");
    }
  };

  // Archive / Restore Event Handler
  const handleArchiveToggle = async (eventId: string, archive: boolean) => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, archive }),
      });

      if (res.ok) {
        fetchData();
        triggerNotice(
          archive
            ? "Event archived! It is now hidden from the public site while all data remains safe here."
            : "Event restored! It will now appear on the public events page.",
          "success"
        );
      }
    } catch {
      triggerNotice("Failed to update event archive status", "error");
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const triggerNotice = (text: string, type: "success" | "error") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Filtering Logic
  const filteredAttendees = useMemo(() => {
    return attendees.filter((a) => {
      // Event filter (supports exact id, arena- prefix, and event name)
      if (selectedEvent !== "all") {
        const selEvt = events.find((e) => e.id === selectedEvent);
        const matchId = a.event_id === selectedEvent;
        const matchCleanId =
          a.event_id.replace(/^arena-/, "") === selectedEvent.replace(/^arena-/, "");
        const matchName =
          selEvt &&
          a.event_name &&
          (a.event_name.toLowerCase().includes(selEvt.name.toLowerCase()) ||
            selEvt.name.toLowerCase().includes(a.event_name.toLowerCase()));
        if (!matchId && !matchCleanId && !matchName) return false;
      }

      // Status filter
      if (selectedStatus !== "all" && a.status.toLowerCase() !== selectedStatus.toLowerCase())
        return false;

      // Attendance filter
      if (selectedAttendance === "attended" && !a.verified_at) return false;
      if (selectedAttendance === "pending" && a.verified_at) return false;

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          a.participant_name.toLowerCase().includes(q) ||
          a.college_roll_number.toLowerCase().includes(q) ||
          a.ticket_id.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.college.toLowerCase().includes(q) ||
          a.branch.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [attendees, events, selectedEvent, selectedStatus, selectedAttendance, searchQuery]);

  // Table selection helpers
  const isAllSelected =
    filteredAttendees.length > 0 &&
    filteredAttendees.every((a) => selectedTickets.has(a.ticket_id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(filteredAttendees.map((a) => a.ticket_id)));
    }
  };

  const handleSelectOne = (ticketId: string) => {
    const updated = new Set(selectedTickets);
    if (updated.has(ticketId)) {
      updated.delete(ticketId);
    } else {
      updated.add(ticketId);
    }
    setSelectedTickets(updated);
  };

  // Events filtered by active / archived tab
  const displayEvents = useMemo(() => {
    return events.filter((e) => {
      if (eventViewFilter === "active") return !e.is_archived;
      if (eventViewFilter === "archived") return e.is_archived;
      return true;
    });
  }, [events, eventViewFilter]);

  // Statistics Computations from Supabase
  const totalCount = attendees.length;
  const checkedInCount = attendees.filter((a) => a.verified_at !== null).length;
  const pendingCount = totalCount - checkedInCount;
  const activeEventsCount = events.filter((e) => !e.is_archived).length;
  const archivedEventsCount = events.filter((e) => e.is_archived).length;

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedEvent !== "all" ||
    selectedAttendance !== "all" ||
    selectedStatus !== "all"
  );

  // Time formatting helper for check-ins (e.g. "✓ Checked in · 11:16 PM")
  const formatCheckInTime = (dateStr: string | null): string => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
      return "";
    }
  };

  return (
    <div className={styles.adminLayout}>
      {/* ====================================================================
          LEFT SIDEBAR (Priority 1: Only Applicants Active, Overview Neutral)
          ==================================================================== */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.goBackBtn} title="Back to public site">
            <ChevronLeft size={16} />
            {!sidebarCollapsed && <span>&larr; Back to Site</span>}
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {/* Section: Overview (Neutral State) */}
          <div className={styles.navSection}>
            {!sidebarCollapsed && <span className={styles.navSectionTitle}>PORTAL</span>}
            <button
              type="button"
              onClick={() => {
                setActiveTab("applicants");
                setSelectedAttendance("all");
              }}
              className={`${styles.navItem} ${styles.navItemNeutral}`}
              title="Overview & summary"
            >
              <Layers size={17} className={styles.navItemIcon} />
              {!sidebarCollapsed && <span>Overview</span>}
            </button>
          </div>

          {/* Section: Audience (Priority 1: Strictly Active for Applicants) */}
          <div className={styles.navSection}>
            {!sidebarCollapsed && <span className={styles.navSectionTitle}>AUDIENCE</span>}
            <button
              type="button"
              onClick={() => {
                setActiveTab("applicants");
                setSelectedAttendance("all");
              }}
              className={`${styles.navItem} ${activeTab === "applicants" && selectedAttendance === "all" ? styles.navItemActive : ""}`}
            >
              <Users size={17} className={styles.navItemIcon} />
              {!sidebarCollapsed && (
                <>
                  <span>Applicants</span>
                  <span className={styles.navBadge}>{totalCount}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("applicants");
                setSelectedAttendance("attended");
              }}
              className={`${styles.navItem} ${activeTab === "applicants" && selectedAttendance === "attended" ? styles.navItemActive : ""}`}
            >
              <CheckCircle2 size={17} className={styles.navItemIcon} />
              {!sidebarCollapsed && (
                <>
                  <span>Checked In</span>
                  <span className={styles.navBadge}>{checkedInCount}</span>
                </>
              )}
            </button>
          </div>

          {/* Section: Events Management */}
          <div className={styles.navSection}>
            {!sidebarCollapsed && <span className={styles.navSectionTitle}>EVENTS</span>}
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`${styles.navItem} ${activeTab === "events" ? styles.navItemActive : ""}`}
            >
              <Calendar size={17} className={styles.navItemIcon} />
              {!sidebarCollapsed && (
                <>
                  <span>All Events</span>
                  <span className={styles.navBadge}>{events.length}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className={styles.navItem}
              title="Create a new festival competition arena"
            >
              <Plus size={17} className={styles.navItemIcon} />
              {!sidebarCollapsed && <span>+ Create Event</span>}
            </button>
          </div>
        </nav>

        {/* Sidebar Footer: Active Coordinator Profile */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div
              className={styles.userAvatar}
              style={{ backgroundColor: currentAdmin.avatarColor }}
            >
              {currentAdmin.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            {!sidebarCollapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>{currentAdmin.name}</div>
                <div className={styles.userRole}>{currentAdmin.role}</div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className={styles.logoutBtn}
              title="Sign Out of Operations Console"
            >
              <LogOut size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={styles.collapseBtn}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={15}
              style={{ transform: sidebarCollapsed ? "rotate(180deg)" : "none" }}
            />
            {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>

      {/* ====================================================================
          MAIN CONTENT AREA (Priority 10: Strict Visual Hierarchy)
          Hierarchy: Context -> Compact KPIs -> Grouped Filters -> Table Toolbar -> Master Table
          ==================================================================== */}
      <main className={styles.mainContent}>
        {/* Status Toast Notice */}
        {feedbackMsg && (
          <div
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              background: feedbackMsg.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(229, 29, 37, 0.12)",
              border: `1px solid ${feedbackMsg.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(229, 29, 37, 0.35)"}`,
              color: feedbackMsg.type === "success" ? "#34d399" : "#ff525a",
              fontSize: "0.82rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {feedbackMsg.type === "success" ? <Check size={15} /> : <X size={15} />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* ==================================================================
            VIEW SWITCHER: APPLICANTS OR EVENTS
            ================================================================== */}
        {activeTab === "applicants" ? (
          <>
            {/* 1. ESTABLISH PAGE CONTEXT (Priority 1) */}
            <header className={styles.pageContextBar}>
              <div className={styles.pageContextLeft}>
                <div className={styles.pageTitleRow}>
                  <h1 className={styles.pageHeading}>Applicants</h1>
                  {/* Secondary Festival Selector Tag */}
                  <div className={styles.festivalChip} title="Festival Edition">
                    <Calendar size={13} className={styles.festivalChipIcon} />
                    <span>AMEYA '26 &bull; Feb 20&ndash;21</span>
                  </div>
                </div>
                <p className={styles.pageSubheading}>
                  Track registrations, verify attendance, and manage delegates across all festival arenas.
                </p>
              </div>

              <div className={styles.pageContextRight}>
                <button
                  type="button"
                  onClick={fetchData}
                  className={styles.refreshDataBtn}
                  title="Sync live records from Supabase"
                >
                  <RefreshCw size={13} className={loading ? styles.spinning : ""} />
                  <span>Sync Supabase</span>
                </button>
              </div>
            </header>

            {/* 2. REDUCED PROMINENCE KPI SUMMARY STRIP (Priority 3) */}
            <section className={styles.kpiStrip} aria-label="Registration Statistics">
              {/* Metric 1: Total */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiLeft}>
                  <span className={styles.kpiLabel}>Total Registered</span>
                  <span className={styles.kpiValue}>{totalCount}</span>
                </div>
                <span className={`${styles.kpiBadge} ${styles.kpiBadgeNeutral}`}>
                  Delegates
                </span>
              </div>

              {/* Metric 2: Checked In (Green Semantic) */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiLeft}>
                  <span className={styles.kpiLabel}>Checked In</span>
                  <span className={styles.kpiValue} style={{ color: "#34d399" }}>
                    {checkedInCount}
                  </span>
                </div>
                <span className={`${styles.kpiBadge} ${styles.kpiBadgeSuccess}`}>
                  ✓ Present
                </span>
              </div>

              {/* Metric 3: Pending Attendance (Amber Semantic) */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiLeft}>
                  <span className={styles.kpiLabel}>Pending Check-In</span>
                  <span className={styles.kpiValue} style={{ color: "#fbbf24" }}>
                    {pendingCount}
                  </span>
                </div>
                <span className={`${styles.kpiBadge} ${styles.kpiBadgeWarning}`}>
                  Awaiting
                </span>
              </div>

              {/* Metric 4: Active Arenas */}
              <div className={styles.kpiCard}>
                <div className={styles.kpiLeft}>
                  <span className={styles.kpiLabel}>Active Arenas</span>
                  <span className={styles.kpiValue}>{activeEventsCount}</span>
                </div>
                <span className={`${styles.kpiBadge} ${styles.kpiBadgeInfo}`}>
                  <Radio size={11} />
                  <span>Live</span>
                </span>
              </div>
            </section>

            {/* 3. SIMPLIFIED GROUPED FILTER ROW (Priority 2)
                Order: Search -> Event -> Attendance -> Status -> Reset */}
            <div className={styles.filterRow}>
              {/* 1. Search Box */}
              <div className={styles.searchBox}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, roll no, ticket ID, phone..."
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={styles.clearSearchBtn}
                    title="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* 2. Event Filter */}
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className={styles.filterSelect}
                aria-label="Filter by Event Arena"
              >
                <option value="all">All Arenas ({events.length})</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} {evt.is_archived ? "(Archived)" : `(Day ${evt.day})`}
                  </option>
                ))}
              </select>

              {/* 3. Attendance Filter */}
              <select
                value={selectedAttendance}
                onChange={(e) => setSelectedAttendance(e.target.value)}
                className={styles.filterSelect}
                aria-label="Filter by Attendance"
              >
                <option value="all">Attendance: All</option>
                <option value="attended">Checked In</option>
                <option value="pending">Not Checked In</option>
              </select>

              {/* 4. Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.filterSelect}
                aria-label="Filter by Status"
              >
                <option value="all">Status: All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>

              {/* 5. Reset Filter Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedEvent("all");
                    setSelectedAttendance("all");
                    setSelectedStatus("all");
                  }}
                  className={styles.resetFiltersBtn}
                  title="Reset all filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* 4. TABLE TOOLBAR & CONTEXTUAL BULK ACTIONS (Priority 7 & Priority 8: No Create Event CTA) */}
            <div
              className={`${styles.tableToolbar} ${
                selectedTickets.size > 0 ? styles.tableToolbarActive : ""
              }`}
            >
              <div className={styles.toolbarLeft}>
                {selectedTickets.size > 0 ? (
                  <span className={styles.selectedPill}>
                    {selectedTickets.size} selected
                  </span>
                ) : (
                  <span className={styles.recordsCount}>
                    Showing <strong>{filteredAttendees.length}</strong> of {totalCount} registered delegates
                  </span>
                )}
              </div>

              <div className={styles.toolbarActions}>
                {selectedTickets.size > 0 ? (
                  <>
                    {/* Contextual Bulk Actions */}
                    <button
                      type="button"
                      onClick={() => handleBulkAttendance(true)}
                      className={styles.btnBulkCheckIn}
                      title="Mark all selected delegates present"
                    >
                      <CheckCircle2 size={14} />
                      <span>Check In ({selectedTickets.size})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkAttendance(false)}
                      className={styles.btnBulkReset}
                      title="Reset attendance for selected delegates"
                    >
                      <RotateCcw size={13} />
                      <span>Reset ({selectedTickets.size})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportCSV(true)}
                      className={styles.btnSecondary}
                      title="Download selected delegate records as CSV"
                    >
                      <Download size={13} />
                      <span>Export Selected</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTickets(new Set())}
                      className={styles.btnGhost}
                      title="Clear selection"
                    >
                      <X size={13} />
                      <span>Deselect All</span>
                    </button>
                  </>
                ) : (
                  /* Standard Table-Level Action (Priority 2) */
                  <button
                    type="button"
                    onClick={() => handleExportCSV(false)}
                    className={styles.btnSecondary}
                    title="Export currently filtered attendees to CSV"
                  >
                    <Download size={13} />
                    <span>Download CSV</span>
                  </button>
                )}
              </div>
            </div>

            {/* 5. REDESIGNED APPLICANT MASTER TABLE (Priority 4, 5, 6: Dominant Viewport Element) */}
            <div className={styles.tableCard}>
              <div className={styles.tableResponsive}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr className={styles.tableHeaderRow}>
                      <th style={{ width: 40, textAlign: "center" }} className={styles.tableHeaderCell}>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                          style={{ cursor: "pointer", width: 15, height: 15 }}
                          aria-label="Select all applicants"
                        />
                      </th>
                      <th className={styles.tableHeaderCell}>APPLICANT</th>
                      <th className={styles.tableHeaderCell}>ROLL NO / ID</th>
                      <th className={styles.tableHeaderCell}>BRANCH &amp; COLLEGE</th>
                      <th className={styles.tableHeaderCell}>EVENT</th>
                      <th className={styles.tableHeaderCell}>TICKET ID</th>
                      <th className={styles.tableHeaderCell}>APPLICATION</th>
                      <th className={styles.tableHeaderCell} style={{ minWidth: 150 }}>
                        CHECK-IN STATUS
                      </th>
                      <th className={styles.tableHeaderCell} style={{ textAlign: "center" }}>
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                          Connecting to Supabase and loading live records...
                        </td>
                      </tr>
                    ) : filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "3.5rem", color: "#94a3b8" }}>
                          No applicants found matching the selected filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendees.map((att) => {
                        const isSelected = selectedTickets.has(att.ticket_id);
                        const isCheckedIn = Boolean(att.verified_at);

                        return (
                          <tr
                            key={att.ticket_id}
                            className={`${styles.tableRow} ${isSelected ? styles.rowSelected : ""}`}
                          >
                            {/* Checkbox */}
                            <td style={{ textAlign: "center" }} className={styles.tableCell}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectOne(att.ticket_id)}
                                style={{ cursor: "pointer", width: 15, height: 15 }}
                                aria-label={`Select ${att.participant_name}`}
                              />
                            </td>

                            {/* Column 2: Applicant (Name + Email on secondary line) */}
                            <td className={styles.tableCell}>
                              <div className={styles.applicantCell}>
                                <div
                                  className={styles.avatarCircle}
                                  style={{ backgroundColor: att.avatar_color }}
                                >
                                  {att.participant_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")}
                                </div>
                                <div className={styles.applicantMeta}>
                                  <span className={styles.applicantName}>
                                    {att.participant_name}
                                  </span>
                                  <a
                                    href={`mailto:${att.email}`}
                                    className={styles.applicantEmail}
                                    title={`Send email to ${att.email}`}
                                  >
                                    {att.email}
                                  </a>
                                </div>
                              </div>
                            </td>

                            {/* Column 3: College Roll Number / ID (Separate column, monospace, no wrap) */}
                            <td className={styles.tableCell}>
                              <span className={styles.rollNumberText}>
                                {att.college_roll_number}
                              </span>
                            </td>

                            {/* Column 4: Branch & College (Separate column) */}
                            <td className={styles.tableCell}>
                              <div className={styles.deptMeta}>
                                <span className={styles.branchText}>{att.branch}</span>
                                <span className={styles.collegeText}>{att.college}</span>
                              </div>
                            </td>

                            {/* Column 5: Event Badge (One line, truncated if long) */}
                            <td className={styles.tableCell}>
                              <span className={styles.eventBadge} title={att.event_name}>
                                {att.event_name}
                              </span>
                            </td>

                            {/* Column 6: Ticket ID (Priority 6: Neutral code styling, NOT RED!) */}
                            <td className={styles.tableCell}>
                              <button
                                type="button"
                                onClick={() => setSelectedTicketModal(att)}
                                className={styles.ticketBadgeNeutral}
                                title="Click to view ticket dossier"
                              >
                                {att.ticket_id}
                              </button>
                            </td>

                            {/* Column 7: Application Status (Separate from attendance) */}
                            <td className={styles.tableCell}>
                              <span
                                className={`${styles.statusBadge} ${
                                  att.status.toLowerCase() === "approved"
                                    ? styles.statusApproved
                                    : styles.statusPending
                                }`}
                              >
                                <ShieldCheck size={11} />
                                <span>{att.status}</span>
                              </span>
                            </td>

                            {/* Column 8: Check-In Status (Priority 5: Most Prominent Row Action) */}
                            <td className={`${styles.tableCell} ${styles.attendanceCell}`}>
                              {isCheckedIn ? (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAttendance(att)}
                                  className={styles.checkedInBadge}
                                  title={`Checked in by ${att.verified_by || "Coordinator"}. Click to reset.`}
                                >
                                  <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
                                  <span>
                                    ✓ Checked in &bull; {formatCheckInTime(att.verified_at)}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleAttendance(att)}
                                  className={styles.btnCheckInAction}
                                  title="Mark delegate present at venue"
                                >
                                  <Check size={14} />
                                  <span>Check In</span>
                                </button>
                              )}
                            </td>

                            {/* Column 9: Actions (Inspect / View Dossier) */}
                            <td className={styles.tableCell} style={{ textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={() => setSelectedTicketModal(att)}
                                className={styles.btnInspectRow}
                                title="Inspect ticket details"
                              >
                                <Eye size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* ================================================================
             EVENTS MANAGEMENT VIEW (Separate context where + Create Event lives)
             ================================================================ */
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div className={styles.tableHeaderBar} style={{ background: "transparent", borderBottom: "none", padding: 0 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#f2ede8" }}>
                  Festival Event Management &amp; Archival
                </h2>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.82rem", color: "#94a3b8" }}>
                  Created events appear immediately on the public website. Archived events are hidden from the public, but their attendee records remain preserved here.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  href="/events"
                  target="_blank"
                  className={styles.btnSecondary}
                  style={{ textDecoration: "none" }}
                >
                  <span>View Public Events Page</span>
                  <ExternalLink size={13} />
                </Link>
                {/* + Create Event belongs here in Events context (Priority 8) */}
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className={styles.btnSecondary}
                  style={{ background: "#e51d25", color: "#fff", borderColor: "#ff4d55" }}
                >
                  <Plus size={14} />
                  <span>+ Create New Event</span>
                </button>
              </div>
            </div>

            {/* Event Sub-filter Pills */}
            <div style={{ display: "flex", gap: "0.5rem", margin: "1.25rem 0 1rem 0" }}>
              <button
                type="button"
                onClick={() => setEventViewFilter("all")}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: eventViewFilter === "all" ? "#e51d25" : "rgba(255, 255, 255, 0.1)",
                  background: eventViewFilter === "all" ? "rgba(229, 29, 37, 0.18)" : "#121217",
                  color: eventViewFilter === "all" ? "#ff525a" : "#a1a1aa",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                All Arenas ({events.length})
              </button>
              <button
                type="button"
                onClick={() => setEventViewFilter("active")}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: eventViewFilter === "active" ? "#10b981" : "rgba(255, 255, 255, 0.1)",
                  background: eventViewFilter === "active" ? "rgba(16, 185, 129, 0.18)" : "#121217",
                  color: eventViewFilter === "active" ? "#34d399" : "#a1a1aa",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Active on Public Site ({activeEventsCount})
              </button>
              <button
                type="button"
                onClick={() => setEventViewFilter("archived")}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: eventViewFilter === "archived" ? "#f59e0b" : "rgba(255, 255, 255, 0.1)",
                  background: eventViewFilter === "archived" ? "rgba(245, 158, 11, 0.18)" : "#121217",
                  color: eventViewFilter === "archived" ? "#fbbf24" : "#a1a1aa",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Archived / Concluded ({archivedEventsCount})
              </button>
            </div>

            <div className={styles.eventList}>
              {displayEvents.map((evt) => (
                <div key={evt.id} className={styles.eventCardItem}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <h4 style={{ margin: 0, fontSize: "1rem", color: "#f2ede8" }}>
                        {evt.name}
                      </h4>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: evt.category === "Technical" ? "rgba(229, 29, 37, 0.16)" : "rgba(255, 255, 255, 0.08)",
                          color: evt.category === "Technical" ? "#ff525a" : "#d4d4d8",
                          border: "1px solid " + (evt.category === "Technical" ? "rgba(229, 29, 37, 0.35)" : "rgba(255, 255, 255, 0.1)"),
                        }}
                      >
                        {evt.category}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          background: "rgba(255, 255, 255, 0.06)",
                          color: "#f2ede8",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        Day {evt.day}
                      </span>
                      {evt.is_archived ? (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(245, 158, 11, 0.15)",
                            color: "#fbbf24",
                            border: "1px solid rgba(245, 158, 11, 0.35)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <Archive size={11} />
                          HIDDEN FROM PUBLIC SITE (ARCHIVED)
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "#34d399",
                            border: "1px solid rgba(16, 185, 129, 0.35)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <CheckCircle2 size={11} />
                          LIVE ON /events
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.82rem", color: "#94a3b8" }}>
                      Venue: {evt.venue || "Campus Area"} &bull; Time: {evt.time || "TBA"} &bull; Registered Delegates:{" "}
                      <strong>{evt.registered_count || 0}</strong> &bull; Checked In:{" "}
                      <strong style={{ color: "#34d399" }}>{evt.checked_in_count || 0}</strong>
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent(evt.id);
                        setActiveTab("applicants");
                      }}
                      className={styles.btnSecondary}
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                      title="View attendee list for this event"
                    >
                      <Users size={13} />
                      <span>View Delegates ({evt.registered_count || 0})</span>
                    </button>

                    {evt.is_archived ? (
                      <button
                        type="button"
                        onClick={() => handleArchiveToggle(evt.id, false)}
                        className={styles.unarchiveBtn}
                        title="Restore event so it appears on the public events page"
                      >
                        <RotateCcw size={14} style={{ marginRight: "0.3rem" }} />
                        <span>Restore to Public Page</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleArchiveToggle(evt.id, true)}
                        className={styles.archiveBtn}
                        title="Archive event: hides from public events page while preserving all data in admin"
                      >
                        <Archive size={14} />
                        <span>Archive Event</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            CREATE EVENT MODAL
            ================================================================== */}
        {showCreateModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Create New Festival Arena</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={styles.modalCloseBtn}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                      Event Arena Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Drone Precision Challenge"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", background: "#14141b", color: "#f2ede8" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                      Tagline / Catchphrase
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kinetic Aerial Navigation"
                      value={newEvent.tagline}
                      onChange={(e) => setNewEvent({ ...newEvent, tagline: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", background: "#14141b", color: "#f2ede8" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                        Category
                      </label>
                      <select
                        value={newEvent.category}
                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", background: "#14141b", color: "#f2ede8" }}
                      >
                        <option value="Technical">Technical</option>
                        <option value="Non-technical">Non-technical</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                        Day
                      </label>
                      <select
                        value={newEvent.day}
                        onChange={(e) => setNewEvent({ ...newEvent, day: Number(e.target.value) as 1 | 2 })}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", background: "#14141b", color: "#f2ede8" }}
                      >
                        <option value={1}>Day 1 (Feb 20)</option>
                        <option value={2}>Day 2 (Feb 21)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                        Venue
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mechanical Quadrangle"
                        value={newEvent.venue}
                        onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", background: "#14141b", color: "#f2ede8" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                        Timing
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM - 01:00 PM"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", background: "#14141b", color: "#f2ede8" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#a1a1aa", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono, monospace)" }}>
                      Event Overview Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief problem statement or arena description..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      style={{ width: "100%", padding: "0.65rem 0.85rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", outline: "none", resize: "vertical", background: "#14141b", color: "#f2ede8" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      style={{ padding: "0.65rem 1.25rem", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", background: "rgba(255, 255, 255, 0.05)", color: "#d4d4d8", cursor: "pointer", fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: "0.65rem 1.5rem", border: "1px solid #ff4d55", borderRadius: "8px", background: "#e51d25", color: "#ffffff", cursor: "pointer", fontWeight: 700, boxShadow: "0 0 16px rgba(229, 29, 37, 0.4)" }}
                    >
                      Publish Event Arena
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TICKET DOSSIER DETAIL MODAL
            ================================================================== */}
        {selectedTicketModal && (
          <div className={styles.modalOverlay} onClick={() => setSelectedTicketModal(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Delegate Registration Dossier</h3>
                <button
                  type="button"
                  onClick={() => setSelectedTicketModal(null)}
                  className={styles.modalCloseBtn}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.modalBody}>
                {/* Visual Ticket Header */}
                <div style={{ background: "#14141c", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "10px", padding: "1.25rem", textAlign: "center", marginBottom: "1.25rem" }}>
                  <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "1.05rem", fontWeight: 700, color: "#cbd5e1", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                    {selectedTicketModal.ticket_id}
                  </div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f2ede8" }}>
                    {selectedTicketModal.participant_name}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.2rem", fontFamily: "var(--font-mono, monospace)" }}>
                    Roll No: {selectedTicketModal.college_roll_number}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#f2ede8", marginTop: "0.2rem", fontWeight: 600 }}>
                    {selectedTicketModal.branch} &bull; {selectedTicketModal.college}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.85rem", color: "#e4e4e7" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "#94a3b8" }}>Event Registered:</span>
                    <span style={{ fontWeight: 600 }}>{selectedTicketModal.event_name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "#94a3b8" }}>Email:</span>
                    <span>{selectedTicketModal.email}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "#94a3b8" }}>Phone Contact:</span>
                    <span style={{ fontFamily: "var(--font-mono, monospace)" }}>{selectedTicketModal.phone}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.4rem" }}>
                    <span style={{ color: "#94a3b8" }}>Check-In Status:</span>
                    <span style={{ fontWeight: 700, color: selectedTicketModal.verified_at ? "#34d399" : "#fbbf24" }}>
                      {selectedTicketModal.verified_at ? `Present (${formatCheckInTime(selectedTicketModal.verified_at)})` : "Pending (Absent)"}
                    </span>
                  </div>
                  {selectedTicketModal.verified_by && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.4rem" }}>
                      <span style={{ color: "#94a3b8" }}>Verified By:</span>
                      <span style={{ fontWeight: 600 }}>{selectedTicketModal.verified_by}</span>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleAttendance(selectedTicketModal);
                      setSelectedTicketModal(null);
                    }}
                    className={selectedTicketModal.verified_at ? styles.btnBulkReset : styles.btnBulkCheckIn}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    {selectedTicketModal.verified_at ? "Reset Attendance" : "Check In Delegate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTicketModal(null)}
                    className={styles.btnSecondary}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
