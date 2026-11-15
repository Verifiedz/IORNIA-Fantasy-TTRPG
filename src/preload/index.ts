import { contextBridge, ipcRenderer } from "electron";
import { IORNIA_CHANNELS } from "./channels";
import type {
  CharacterFile,
  ContentFile,
  CreateWikiEntryInput,
  IorniaBridge,
  TrackingAction,
} from "./api";

const api: IorniaBridge = {
  campaign: {
    open: () => ipcRenderer.invoke(IORNIA_CHANNELS.campaignOpen),
    getActive: () => ipcRenderer.invoke(IORNIA_CHANNELS.campaignGetActive),
  },
  content: {
    get: (path) => ipcRenderer.invoke(IORNIA_CHANNELS.contentGet, path),
    onChange: (callback) => {
      const listener = (_event: unknown, file: ContentFile): void =>
        callback(file);
      ipcRenderer.on(IORNIA_CHANNELS.contentChanged, listener);
      return () =>
        ipcRenderer.removeListener(IORNIA_CHANNELS.contentChanged, listener);
    },
  },
  codex: {
    listPages: () => ipcRenderer.invoke(IORNIA_CHANNELS.codexListPages),
    getPage: (path) => ipcRenderer.invoke(IORNIA_CHANNELS.codexGetPage, path),
    listTables: () => ipcRenderer.invoke(IORNIA_CHANNELS.codexListTables),
    getTable: (path) =>
      ipcRenderer.invoke(IORNIA_CHANNELS.codexGetTable, path),
    search: (query) => ipcRenderer.invoke(IORNIA_CHANNELS.codexSearch, query),
    onChange: (callback) => {
      const listener = (): void => callback();
      ipcRenderer.on(IORNIA_CHANNELS.codexChanged, listener);
      return () =>
        ipcRenderer.removeListener(IORNIA_CHANNELS.codexChanged, listener);
    },
  },
  characters: {
    list: () => ipcRenderer.invoke(IORNIA_CHANNELS.charactersList),
    get: (slug) => ipcRenderer.invoke(IORNIA_CHANNELS.charactersGet, slug),
    applyTrackingAction: (slug, action: TrackingAction) =>
      ipcRenderer.invoke(
        IORNIA_CHANNELS.charactersApplyTrackingAction,
        slug,
        action,
      ),
    onChange: (callback) => {
      const listener = (_event: unknown, file: CharacterFile): void =>
        callback(file);
      ipcRenderer.on(IORNIA_CHANNELS.charactersChanged, listener);
      return () =>
        ipcRenderer.removeListener(IORNIA_CHANNELS.charactersChanged, listener);
    },
  },
  wiki: {
    list: () => ipcRenderer.invoke(IORNIA_CHANNELS.wikiList),
    create: (input: CreateWikiEntryInput) =>
      ipcRenderer.invoke(IORNIA_CHANNELS.wikiCreate, input),
    onChange: (callback) => {
      const listener = (): void => callback();
      ipcRenderer.on(IORNIA_CHANNELS.wikiChanged, listener);
      return () =>
        ipcRenderer.removeListener(IORNIA_CHANNELS.wikiChanged, listener);
    },
  },
};

contextBridge.exposeInMainWorld("iornia", api);
