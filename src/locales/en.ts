export const en: any = {
    // Navigation
    navHome: "HOME",
    navUsers: "USERS",
    navContact: "CONTACT",
    navLogout: "LOG OUT",

    // Headings and text
    title: "Disc Golf Events",
    pdgaOnly: "PDGA only",
    eventsCount: (displayed: number, total: number) => `${displayed} / ${total} events`,
    noEvents: "No events found matching your filters.",

    // Buttons
    exportBtn: "EXPORT EVENTS",
    importBtn: "IMPORT EVENTS",
    addEventBtn: "ADD EVENT",
    detailsBtn: "DETAILS",
    editBtn: "EDIT",
    deleteBtn: "DELETE",
    cancelBtn: "CANCEL",

    // Table
    colStart: "Tournament Start",
    colTitle: "Tournament Title",
    colPdga: "PDGA",
    colRegistration: "Registration",
    colRegion: "Region",
    colRegStart: "Registration Start",
    colLink: "Link",
    colActions: "Actions",

    // Announcements (Snackbars)
    deleteSuccess: "Event deleted successfully",
    deleteFail: "Failed to delete event",
    exportSuccess: "Export successful",
    exportFail: "Failed to export events",
    importSuccess: "Import successful",
    importFail: "Failed to import events",
    editSuccess: "Successfully edited event",
    editFail: "Failed to edit event",
    errorLoading: "Error loading events: ",
    errFailedToFetch: "Could not connect to the server.",

    // Registration statuses
    statusOPEN: "OPEN",
    statusCLOSED: "CLOSED",
    statusPASSED: "PASSED",
    statusARCHIVED: "ARCHIVED",

    // Modals (confirmation windows)
    modalDeleteTitle: "Delete Event",
    modalDeleteMsg: (title: string) => `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`
};
