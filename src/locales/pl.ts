export const pl: any = {
    // Nawigacja
    navHome: "STRONA GŁÓWNA",
    navUsers: "UŻYTKOWNICY",
    navContact: "KONTAKT",
    navLogout: "WYLOGUJ",
    
    // Nagłówki i teksty
    title: "Turnieje Disc Golf",
    pdgaOnly: "Tylko PDGA",
    eventsCount: (displayed: number, total: number) => `${displayed} / ${total} wydarzeń`,
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

    // Statusy Rejestracji
    statusOPEN: "OTWARTA",
    statusCLOSED: "ZAMKNIĘTA",
    statusPASSED: "ZAKOŃCZONA",
    statusARCHIVED: "ZARCHIWIZOWANY",

    // Szczegóły wydarzenia
    errFetchDetails: "Nie udało się pobrać danych turnieju.",
    backToEvents: "Powrót do turniejów",
    lblTournStart: "Data rozpoczęcia",
    lblTournEnd: "Data zakończenia",
    lblPdga: "PDGA",
    lblRegion: "Region",
    lblRegStart: "Start rejestracji",
    lblRegEnd: "Koniec rejestracji",
    lblDirector: "Dyrektor turnieju",
    lblCapacity: "Liczba miejsc",
    lblExternalLink: "Link zewnętrzny",
    lblWebsite: "Strona turnieju",

    // Formularze (Add / Edit)
    titleAddEvent: "Dodaj nowe wydarzenie",
    titleEditEvent: "Edytuj wydarzenie",
    formTournStart: "Start turnieju",
    formTournEnd: "Koniec turnieju",
    formRegStart: "Start rejestracji",
    formRegEnd: "Koniec rejestracji",
    formTitle: "Nazwa turnieju",
    formPdga: "PDGA",
    formRegion: "Region",
    formDirector: "Dyrektor turnieju",
    formCapacity: "Liczba miejsc",
    formExtLink: "Link zewnętrzny",
    formAnotherLink: "+ kolejny link",
    formRequired: "Pole jest wymagane",
    btnCreate: "Utwórz wydarzenie",
    btnSaveChanges: "Zapisz zmiany",
    msgAddSuccess: "Wydarzenie utworzone pomyślnie!",
    msgAddFail: "Nie udało się utworzyć wydarzenia",

    // Modale
    modalDeleteTitle: "Usuń Wydarzenie",
    modalDeleteMsg: (title: string) => `Czy na pewno chcesz bezpowrotnie usunąć "${title}"? Tej akcji nie można cofnąć.`
  };
  