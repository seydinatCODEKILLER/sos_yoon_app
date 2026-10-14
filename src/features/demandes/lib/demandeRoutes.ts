export const demandeRoutes = {
  /** Liste « Mes demandes » */
  liste: "/app/demandes",
  nouvelle: "/app/demandes/nouvelle",
  /** Suivi de la demande, juste après l'envoi */
  suivi: (id: string) => `/app/demandes/${id}`,
};