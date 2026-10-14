export const demandeRoutes = {
  nouvelle: "/app/demandes/nouvelle",
  /** Suivi de la demande, juste après l'envoi */
  suivi: (id: string) => `/app/demandes/${id}`,
};