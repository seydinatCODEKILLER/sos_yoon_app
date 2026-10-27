import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { agendaApi, type AgendaApi } from "../api/agendaApi";
import { mockAgendaApi } from "./mockAgenda";

export const agendaService: AgendaApi = USE_MOCK_API ? mockAgendaApi : agendaApi;