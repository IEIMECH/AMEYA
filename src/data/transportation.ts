/**
 * AMEYA '26 Transportation & Bus Schedule Configuration
 * 
 * To activate the embedded PDF viewer:
 * 1. Place the official PDF in the public directory (e.g., public/documents/college_bus_schedule.pdf)
 * 2. Set `pdfUrl` below to the file path (e.g., "/documents/college_bus_schedule.pdf") or any public URL.
 * 
 * While `pdfUrl` is an empty string (""), the component automatically displays the polished
 * "Bus schedule will be available soon" placeholder.
 */
export const BUS_SCHEDULE_CONFIG = {
  pdfUrl: "", // <-- Place bus schedule PDF path/URL here when available
  title: "College Bus Schedule",
  description: "View the official bus schedule and plan your journey accordingly.",
  emptyNotice: "Bus schedule will be available soon.",
  emptySubnotice: "Please check back later for the official transportation schedule.",
  poc: {
    title: "TRANSPORT & HOSPITALITY POINT OF CONTACT",
    name: "S. Durga Sai Ram",
    phone: "+91 93924 58746",
    description: "For college bus route inquiries, pickup point coordination, and delegate hospitality assistance.",
  },
};
