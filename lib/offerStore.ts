"use client";

import { useSyncExternalStore } from "react";

export type Plan = "subscribe" | "single";
export type Color = "chrome" | "black";

export type OfferState = {
  plan: Plan;
  color: Color;
};

const DEFAULTS: OfferState = { plan: "subscribe", color: "chrome" };

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

export function buildCheckoutHref(s: OfferState = state): string {
  return `/checkout?plan=${s.plan}&color=${s.color}`;
}
