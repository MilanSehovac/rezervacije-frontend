import type { ServicePhase } from "../types";
import { formatMinutes } from "../../helpers/phases";

/**
 * Proportional bar of a service: solid = active (staff works), striped = passive (customer waits,
 * staff is free for other clients).
 */
export function PhaseBar({ phases, className = "" }: { phases: ServicePhase[]; className?: string }) {
  const total = phases.reduce((s, p) => s + p.duration, 0);
  if (total <= 0) return null;
  return (
    <div className={`flex h-5 w-full overflow-hidden rounded-md border ${className}`} role="img"
      aria-label={phases.map((p) => `${p.type} ${p.duration} minutes`).join(", ")}>
      {phases.map((p, i) => (
        <div
          key={i}
          style={{ width: `${(p.duration / total) * 100}%` }}
          title={`${p.type === "active" ? "Active" : "Passive"} ${formatMinutes(p.duration)}`}
          className={`flex items-center justify-center text-[10px] leading-none overflow-hidden whitespace-nowrap ${
            p.type === "active"
              ? "bg-primary text-primary-foreground"
              : "bg-amber-100 text-amber-900 [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.08)_4px,rgba(0,0,0,0.08)_8px)]"
          }`}
        >
          {p.duration}
        </div>
      ))}
    </div>
  );
}

export function PhaseLegend() {
  return (
    <div className="flex gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-primary" /> Active (staff works)</span>
      <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border bg-amber-100" /> Passive (staff is free)</span>
    </div>
  );
}
