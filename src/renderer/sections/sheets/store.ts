import { create } from "zustand";
import type {
  CharacterFile,
  TrackingAction,
  TrackingActionResponse,
} from "../../../preload/api";
import type { TrackingState } from "../../../core/schemas/tracking";
import {
  applyTrackingAction,
  getCharacter,
  listCharacters,
  onCharacterChange,
} from "../../content";

// How many prior tracking states to keep per character for undo. Not
// persisted to tracking.json — per CLAUDE.md, undo is a short runtime
// history, not part of the saved sheet state.
const UNDO_HISTORY_LIMIT = 20;

interface SheetsStore {
  characters: Record<string, CharacterFile>;
  history: Record<string, TrackingState[]>;
  loaded: boolean;
  loadAll: () => Promise<void>;
  dispatch: (
    slug: string,
    action: TrackingAction,
  ) => Promise<TrackingActionResponse | null>;
  canUndo: (slug: string) => boolean;
  undo: (slug: string) => Promise<void>;
}

let unsubscribe: (() => void) | null = null;

export const useSheetsStore = create<SheetsStore>((set, get) => ({
  characters: {},
  history: {},
  loaded: false,

  async loadAll() {
    const files = await listCharacters();
    set({
      characters: Object.fromEntries(files.map((file) => [file.slug, file])),
      loaded: true,
    });

    unsubscribe?.();
    unsubscribe = onCharacterChange((file) => {
      set((state) => ({
        characters: { ...state.characters, [file.slug]: file },
      }));
    });
  },

  async dispatch(slug, action) {
    const current = get().characters[slug]?.tracking;
    if (current && action.type !== "restore") {
      set((state) => {
        const prior = state.history[slug] ?? [];
        return {
          history: {
            ...state.history,
            [slug]: [...prior, current].slice(-UNDO_HISTORY_LIMIT),
          },
        };
      });
    }

    const response = await applyTrackingAction(slug, action);
    if (response) {
      set((state) => ({
        characters: {
          ...state.characters,
          [slug]: { ...state.characters[slug], tracking: response.tracking },
        },
      }));
    }
    return response;
  },

  canUndo(slug) {
    return (get().history[slug]?.length ?? 0) > 0;
  },

  async undo(slug) {
    const stack = get().history[slug];
    const previous = stack?.at(-1);
    if (!previous) return;

    set((state) => ({
      history: { ...state.history, [slug]: stack.slice(0, -1) },
    }));

    const response = await applyTrackingAction(slug, {
      type: "restore",
      state: previous,
    });
    if (response) {
      set((state) => ({
        characters: {
          ...state.characters,
          [slug]: { ...state.characters[slug], tracking: response.tracking },
        },
      }));
    }
  },
}));

export async function refreshCharacter(slug: string): Promise<void> {
  const file = await getCharacter(slug);
  if (!file) return;
  useSheetsStore.setState((state) => ({
    characters: { ...state.characters, [slug]: file },
  }));
}
