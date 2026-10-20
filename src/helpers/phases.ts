import type { SalonService, ServicePhase } from "../components/types";
import { DEFAULT_TIMEZONE, formatTimeInZone } from "./timezone";

/** Phases of a service; legacy services only have activeDuration / passiveDuration. */
export const getPhases = (service: Pick<SalonService, "phases" | "activeDuration" | "passiveDuration">): ServicePhase[] => {
  if (Array.isArray(service.phases) && service.phases.length > 0) {
    return service.phases.filter((p) => p.duration > 0);
  }
  const phases: ServicePhase[] = [{ type: "active", duration: Number(service.activeDuration) || 0 }];
  if (Number(service.passiveDuration) > 0) phases.push({ type: "passive", duration: Number(service.passiveDuration) });
  return phases.filter((p) => p.duration > 0);
};

export const getTotals = (phases: ServicePhase[]) => {
  const active = phases.filter((p) => p.type === "active").reduce((s, p) => s + p.duration, 0);
  const passive = phases.filter((p) => p.type === "passive").reduce((s, p) => s + p.duration, 0);
  return { active, passive, total: active + passive };
};

/** Keeps the legacy duration fields in sync with the phases. */
export const withPhases = <T extends SalonService>(service: T, phases: ServicePhase[]): T => {
  const t = getTotals(phases);
  return { ...service, phases, activeDuration: t.active, passiveDuration: t.passive };
};

export const formatMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
};

/** Wall-clock time shown in the salon's timezone (what the opening hours are expressed in). */
export const formatTime = (iso: string | number | Date, timeZone: string = DEFAULT_TIMEZONE) =>
  formatTimeInZone(iso, timeZone);
