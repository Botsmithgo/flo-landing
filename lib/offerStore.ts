"use client";

import { useSyncExternalStore } from "react";

export type Plan = "subscribe" | "single";
export type Color = "chrome" | "black";

export type OfferState = {
  plan: Plan;
  color: Color;
};

// Cold paid-social visitors should never be placed into a recurring plan by
// default. Subscription remains prominent, but requires an explicit choice.
const DEFAULTS: OfferState = { plan: "single", color: "chrome" };

let state: OfferState = DEFAULTS;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setOffer(partial: Partial<OfferState>) {
  state = { ...state, ...partial };
  emit();
}

export function getOffer(): OfferState {
  return state;
}

export function useOffer(): OfferState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => DEFAULTS,
  );
}
