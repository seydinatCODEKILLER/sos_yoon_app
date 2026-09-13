import { create } from "zustand";

type VoiceDraftState = {
  mediaBlobUrl: string | null;
  duration: number;
  setDraft: (mediaBlobUrl: string, duration: number) => void;
  clearDraft: () => void;
};

export const useVoiceDraftStore = create<VoiceDraftState>((set) => ({
  mediaBlobUrl: null,
  duration: 0,
  setDraft: (mediaBlobUrl, duration) => set({ mediaBlobUrl, duration }),
  clearDraft: () => set({ mediaBlobUrl: null, duration: 0 }),
}));