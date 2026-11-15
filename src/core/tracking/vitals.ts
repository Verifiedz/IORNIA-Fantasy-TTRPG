import type { TrackingState } from "../schemas/tracking";

export interface VitalStatus {
  bloodied: boolean;
  critical: boolean;
}

export function adjustHp(state: TrackingState, delta: number): TrackingState {
  return { ...state, hp: state.hp + delta };
}

export function adjustFp(state: TrackingState, delta: number): TrackingState {
  return { ...state, fp: state.fp + delta };
}

export function vitalStatus(current: number, max: number): VitalStatus {
  return { bloodied: current <= max / 3, critical: current <= 0 };
}
