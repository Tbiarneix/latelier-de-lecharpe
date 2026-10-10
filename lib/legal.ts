/**
 * Informations de la page « Mentions légales ».
 * Les champs vides ne sont pas affichés : les renseigner avant la mise en ligne (obligation LCEN).
 */
export const LEGAL = {
  name: "L'Atelier de l'Écharpe",
  address: "8 rue de l'Écharpe, 31000 Toulouse",
  phone: "+33 5 34 30 93 35",
  email: "atelier1524@orange.fr",
  /** Forme juridique et capital, ex. « SARL au capital de 1 000 € ». */
  legalForm: "",
  /** Numéro SIRET. */
  siret: "",
  /** Numéro de TVA intracommunautaire (facultatif). */
  vat: "",
  /** Nom du directeur de la publication. */
  publisher: "",
  /** Conception du site. */
  designer: "Pablo Ortega",
};

export const LEGAL_MISSING = (["legalForm", "siret", "publisher"] as const).filter((k) => !LEGAL[k]);
