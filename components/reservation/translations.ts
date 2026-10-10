import type { Locale } from "@/lib/reservations/locales";

export type Translation = {
  title: string;
  language: string;
  fullNameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  typeLegend: string;
  clasicTableReservation: string;
  groupFormulaReservation: string;
  numberOfGuestsLabel: string;
  formulaLegend: string;
  formulaSelectorLabel: string;
  groupGuestsLabel: string;
  eventDateLabel: string;
  datePlaceholder: string;
  eventTimeLabel: string;
  selectTime: string;
  selectDateFirst: string;
  noTimes: string;
  specialRequestsLabel: string;
  submitButton: string;
  sending: string;
  afterSentMessage: string;
  legendClosedDay: string;
  legendFullDay: string;
  errorSummary: string;
  errors: Record<string, string>;
};

// Textes repris du formulaire existant ; ajouts : libellés d'accessibilité et messages d'erreur.
export const translations: Record<Locale, Translation> = {
  fr: {
    title: "Demande de réservation",
    language: "Langue",
    fullNameLabel: "Nom complet",
    emailLabel: "Email",
    phoneLabel: "Téléphone",
    typeLegend: "Type de réservation",
    clasicTableReservation: "Réservation classique pour une table",
    groupFormulaReservation: "Réservation pour un groupe avec formule",
    numberOfGuestsLabel: "Nombre de couverts",
    formulaLegend: "Formule",
    formulaSelectorLabel:
      "Le détail des formules est disponible sur notre page d'accueil. Les formules sont obligatoires à partir de 14 personnes. La totalité des convives doivent sélectionner la même formule.",
    groupGuestsLabel: "Nombre de convives",
    eventDateLabel: "Date",
    datePlaceholder: "Sélectionner une date",
    eventTimeLabel: "Heure",
    selectTime: "Choisir une heure",
    selectDateFirst: "Choisissez d'abord une date",
    noTimes: "Aucun horaire disponible",
    specialRequestsLabel: "Demandes spéciales",
    submitButton: "ENVOYER LA DEMANDE",
    sending: "ENVOI EN COURS…",
    afterSentMessage:
      "Merci pour votre demande de réservation ! Un email de confirmation vous sera envoyé sous peu. Veuillez vérifier votre boîte mail.",
    legendClosedDay: "Fermé",
    legendFullDay: "Complet",
    errorSummary: "Le formulaire contient des erreurs. Corrigez les champs signalés.",
    errors: {
      required: "Ce champ est obligatoire.",
      tooLong: "Texte trop long.",
      invalid: "Valeur invalide.",
      email: "Adresse email invalide.",
      phone: "Numéro de téléphone invalide.",
      covers: "Indiquez un nombre de personnes valide.",
      coversGroup: "À partir de 14 personnes, choisissez « Réservation pour un groupe avec formule ».",
      formula: "Choisissez une formule.",
      datePast: "Cette date est passée.",
      dateTooLate: "Les réservations pour le jour même sont fermées à partir de 16h.",
      dateFull: "Le restaurant est complet pour ce jour.",
      dateClosed: "Le restaurant est fermé ce jour.",
      time: "Choisissez une heure dans la liste.",
      tooMany: "Trop de demandes en peu de temps. Réessayez dans quelques minutes ou appelez-nous.",
      server: "Une erreur est survenue. Réessayez ou appelez-nous.",
    },
  },
  en: {
    title: "Reservation request",
    language: "Language",
    fullNameLabel: "Full name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    typeLegend: "Type of reservation",
    clasicTableReservation: "Standard table reservation",
    groupFormulaReservation: "Group reservation with package deal",
    numberOfGuestsLabel: "Number of people",
    formulaLegend: "Package",
    formulaSelectorLabel:
      "Details of the packages are available on our homepage. Packages are mandatory for groups of 14 or more people. All guests must select the same package.",
    groupGuestsLabel: "Number of guests",
    eventDateLabel: "Date",
    datePlaceholder: "Select a date",
    eventTimeLabel: "Time",
    selectTime: "Choose a time",
    selectDateFirst: "Choose a date first",
    noTimes: "No time available",
    specialRequestsLabel: "Special requests",
    submitButton: "SEND REQUEST",
    sending: "SENDING…",
    afterSentMessage:
      "Thank you for your booking request! A confirmation email will be sent to you shortly. Please check your mailbox.",
    legendClosedDay: "Closed",
    legendFullDay: "Full",
    errorSummary: "The form contains errors. Please correct the highlighted fields.",
    errors: {
      required: "This field is required.",
      tooLong: "Text too long.",
      invalid: "Invalid value.",
      email: "Invalid email address.",
      phone: "Invalid phone number.",
      covers: "Enter a valid number of people.",
      coversGroup: "For 14 people or more, choose “Group reservation with package deal”.",
      formula: "Choose a package.",
      datePast: "This date is in the past.",
      dateTooLate: "Same-day reservations close at 4 pm.",
      dateFull: "The restaurant is fully booked for this day.",
      dateClosed: "The restaurant is closed on this day.",
      time: "Choose a time from the list.",
      tooMany: "Too many requests in a short time. Try again in a few minutes or call us.",
      server: "Something went wrong. Please try again or call us.",
    },
  },
  es: {
    title: "Solicitud de reserva",
    language: "Idioma",
    fullNameLabel: "Nombre completo",
    emailLabel: "Correo electrónico",
    phoneLabel: "Teléfono",
    typeLegend: "Tipo de reserva",
    clasicTableReservation: "Reserva clásica para una mesa",
    groupFormulaReservation: "Reserva para un grupo con fórmula",
    numberOfGuestsLabel: "Número de personas",
    formulaLegend: "Fórmula",
    formulaSelectorLabel:
      "Los detalles de los paquetes están disponibles en nuestra página de inicio. Los menús son obligatorios a partir de 14 personas. Todos los comensales deben seleccionar el mismo menú.",
    groupGuestsLabel: "Número de comensales",
    eventDateLabel: "Fecha",
    datePlaceholder: "Seleccionar una fecha",
    eventTimeLabel: "Hora",
    selectTime: "Elegir una hora",
    selectDateFirst: "Elija primero una fecha",
    noTimes: "Ningún horario disponible",
    specialRequestsLabel: "Solicitudes especiales",
    submitButton: "ENVIAR SOLICITUD",
    sending: "ENVIANDO…",
    afterSentMessage:
      "¡Gracias por su solicitud de reserva! Un correo electrónico de confirmación le será enviado en breve. Por favor, verifique su bandeja de entrada.",
    legendClosedDay: "Cerrado",
    legendFullDay: "Completo",
    errorSummary: "El formulario contiene errores. Corrija los campos señalados.",
    errors: {
      required: "Este campo es obligatorio.",
      tooLong: "Texto demasiado largo.",
      invalid: "Valor no válido.",
      email: "Dirección de correo no válida.",
      phone: "Número de teléfono no válido.",
      covers: "Indique un número de personas válido.",
      coversGroup: "A partir de 14 personas, elija «Reserva para un grupo con fórmula».",
      formula: "Elija una fórmula.",
      datePast: "Esta fecha ya ha pasado.",
      dateTooLate: "Las reservas para el mismo día se cierran a las 16:00.",
      dateFull: "El restaurante está completo para este día.",
      dateClosed: "El restaurante está cerrado ese día.",
      time: "Elija una hora de la lista.",
      tooMany: "Demasiadas solicitudes en poco tiempo. Inténtelo de nuevo en unos minutos o llámenos.",
      server: "Se ha producido un error. Inténtelo de nuevo o llámenos.",
    },
  },
  it: {
    title: "Richiesta di prenotazione",
    language: "Lingua",
    fullNameLabel: "Nome completo",
    emailLabel: "Email",
    phoneLabel: "Telefono",
    typeLegend: "Tipo di prenotazione",
    clasicTableReservation: "Prenotazione classica per un tavolo",
    groupFormulaReservation: "Prenotazione per un gruppo con formula",
    numberOfGuestsLabel: "Numero di persone",
    formulaLegend: "Formula",
    formulaSelectorLabel:
      "I dettagli delle formule sono disponibili sulla nostra home page. I menu fissi sono obbligatori a partire da 14 persone. Tutti gli ospiti devono scegliere lo stesso menu.",
    groupGuestsLabel: "Numero di ospiti",
    eventDateLabel: "Data",
    datePlaceholder: "Seleziona una data",
    eventTimeLabel: "Ora",
    selectTime: "Scegli un orario",
    selectDateFirst: "Scegli prima una data",
    noTimes: "Nessun orario disponibile",
    specialRequestsLabel: "Richieste speciali",
    submitButton: "INVIA LA RICHIESTA",
    sending: "INVIO IN CORSO…",
    afterSentMessage:
      "Grazie per la tua richiesta di prenotazione! Una email di conferma ti sarà inviata a breve. Controlla la tua casella di posta.",
    legendClosedDay: "Chiuso",
    legendFullDay: "Completo",
    errorSummary: "Il modulo contiene errori. Correggi i campi segnalati.",
    errors: {
      required: "Campo obbligatorio.",
      tooLong: "Testo troppo lungo.",
      invalid: "Valore non valido.",
      email: "Indirizzo email non valido.",
      phone: "Numero di telefono non valido.",
      covers: "Inserisci un numero di persone valido.",
      coversGroup: "A partire da 14 persone, scegli «Prenotazione per un gruppo con formula».",
      formula: "Scegli una formula.",
      datePast: "Questa data è passata.",
      dateTooLate: "Le prenotazioni per lo stesso giorno chiudono alle 16:00.",
      dateFull: "Il ristorante è al completo per questo giorno.",
      dateClosed: "Il ristorante è chiuso in questo giorno.",
      time: "Scegli un orario dall'elenco.",
      tooMany: "Troppe richieste in poco tempo. Riprova tra qualche minuto o chiamaci.",
      server: "Si è verificato un errore. Riprova o chiamaci.",
    },
  },
};

export const LANGUAGE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  it: "Italiano",
};
