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

    // Event details
    errFetchDetails: "The tournament data could not be fetched.",
    backToEvents: "Back to Events",
    lblTournStart: "Tournament date start",
    lblTournEnd: "Tournament date end",
    lblPdga: "PDGA",
    lblRegion: "Region",
    lblRegStart: "Registration start",
    lblRegEnd: "Registration end",
    lblDirector: "Tournament director",
    lblCapacity: "Capacity",
    lblExternalLink: "External Link",
    lblWebsite: "Tournament website",

    // Forms (Add / Edit) 
    titleAddEvent: "Add New Event",
    titleEditEvent: "Edit Event",
    formTournStart: "Tournament Start",
    formTournEnd: "Tournament End",
    formRegStart: "Registration Start",
    formRegEnd: "Registration End",
    formTitle: "Tournament Title",
    formPdga: "PDGA",
    formRegion: "Region",
    formDirector: "Tournament Director",
    formCapacity: "Capacity",
    formExtLink: "External Link",
    formAnotherLink: "+ another link",
    formRequired: "Field is required",
    btnCreate: "Create Event",
    btnSaveChanges: "Save Changes",
    msgAddSuccess: "Event created successfully!",
    msgAddFail: "Failed to create event",

    // Modals (confirmation windows)
    modalDeleteTitle: "Delete Event",
    modalDeleteMsg: (title: string) => `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`
};
