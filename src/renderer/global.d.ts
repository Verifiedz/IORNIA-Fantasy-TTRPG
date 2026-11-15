import type { IorniaBridge } from "../preload/api";

declare global {
  interface Window {
    iornia: IorniaBridge;
  }
}

export {};
