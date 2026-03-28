export const pl: any = {
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
    errFailedToFetch: "Brak połączenia z serwerem.",

    // Modale
    modalDeleteTitle: "Usuń Wydarzenie",
    modalDeleteMsg: (title: string) => `Czy na pewno chcesz bezpowrotnie usunąć "${title}"? Tej akcji nie można cofnąć.`
  };
  