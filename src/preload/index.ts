import { contextBridge, ipcRenderer } from "electron";
import { IORNIA_CHANNELS } from "./channels";
import type { ContentFile, IorniaBridge } from "./api";

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
};

contextBridge.exposeInMainWorld("iornia", api);
