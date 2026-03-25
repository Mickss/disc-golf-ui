export const translations: any = {
  en: {
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

    // Modals (confirmation windows)
    modalDeleteTitle: "Delete Event",
    modalDeleteMsg: (title: string) => `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`
  },
  
  pl: {
    // Nawigacja
    navHome: "STRONA GŁÓWNA",
    navUsers: "UŻYTKOWNICY",
    navContact: "KONTAKT",
    navLogout: "WYLOGUJ",
    
    // Nagłówki i teksty
    title: "Turnieje Disc Golf",
    pdgaOnly: "Tylko PDGA",
    eventsCount: (displayed: number, total: number) => `${displayed} z ${total} wydarzeń`,
    noEvents: "Nie znaleziono wydarzeń spełniających kryteria.",
    
    // Przyciski
    exportBtn: "EKSPORTUJ",
    importBtn: "IMPORTUJ",
    addEventBtn: "DODAJ WYDARZENIE",
    detailsBtn: "SZCZEGÓŁY",
    editBtn: "EDYTUJ",
    deleteBtn: "USUŃ",
    cancelBtn: "ANULUJ",
    
    // Tabela
    colStart: "Start Turnieju",
    colTitle: "Nazwa Turnieju",
    colPdga: "PDGA",
    colRegistration: "Status rejestracji",
    colRegion: "Region",
    colRegStart: "Start Rejestracji",
    colLink: "Link",
    colActions: "Akcje",
    
    // Komunikaty (Snackbary)
    deleteSuccess: "Pomyślnie usunięto wydarzenie",
    deleteFail: "Nie udało się usunąć wydarzenia",
    exportSuccess: "Eksport zakończony sukcesem",
    exportFail: "Nie udało się wyeksportować wydarzeń",
    importSuccess: "Import zakończony sukcesem",
    importFail: "Nie udało się zaimportować wydarzeń",
    editSuccess: "Pomyślnie zedytowano wydarzenie",
    editFail: "Nie udało się zedytować wydarzenia",
    errorLoading: "Błąd ładowania wydarzeń: ",

    // Modale
    modalDeleteTitle: "Usuń Wydarzenie",
    modalDeleteMsg: (title: string) => `Czy na pewno chcesz bezpowrotnie usunąć "${title}"? Tej akcji nie można cofnąć.`
  }
};
