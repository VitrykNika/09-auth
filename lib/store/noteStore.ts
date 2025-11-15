import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export type NoteDraft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: NoteDraft;
  setDraft: (partial: Partial<NoteDraft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (partial) =>
        set((state) => ({ draft: { ...state.draft, ...partial } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub_draft_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);