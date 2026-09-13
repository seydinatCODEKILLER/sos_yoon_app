import { create } from "zustand";
import type { Metier } from "@/types/user.types";

type Position = { latitude: number; longitude: number };

type WrittenDraftState = {
  message: string | null;
  metier: Metier | null;
  position: Position | null;
  setDraft: (data: { message: string; metier: Metier; position: Position }) => void;
  clearDraft: () => void;
};

export const useWrittenDraftStore = create<WrittenDraftState>((set) => ({
  message: null,
  metier: null,
  position: null,
  setDraft: (data) => set(data),
  clearDraft: () => set({ message: null, metier: null, position: null }),
}));