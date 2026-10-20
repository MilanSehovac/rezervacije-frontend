import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { ServicePhase } from "../types";
import { PhaseBar, PhaseLegend } from "./PhaseBar";
import { formatMinutes, getTotals } from "../../helpers/phases";

interface Props {
  phases: ServicePhase[];
  onChange: (phases: ServicePhase[]) => void;
}

/** Edits an ordered list of active / passive phases, e.g. 30 active -> 60 passive -> 30 active. */
export function PhaseEditor({ phases, onChange }: Props) {
  const update = (index: number, patch: Partial<ServicePhase>) =>
    onChange(phases.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  const remove = (index: number) => onChange(phases.filter((_, i) => i !== index));
  const add = (type: ServicePhase["type"]) => onChange([...phases, { type, duration: type === "active" ? 30 : 15 }]);
  const totals = getTotals(phases);

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {phases.map((phase, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              aria-label={`Phase ${index + 1} type`}
              value={phase.type}
              onChange={(e) => update(index, { type: e.target.value as ServicePhase["type"] })}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="passive">Passive</option>
            </select>
            <Input
              type="number"
              min={5}
              max={600}
              step={5}
              aria-label={`Phase ${index + 1} minutes`}
              value={phase.duration}
              onChange={(e) => update(index, { duration: Math.max(0, Math.round(Number(e.target.value) || 0)) })}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">min</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} disabled={phases.length <= 1} aria-label="Remove phase">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => add("active")}>
          <Plus className="h-3 w-3" /> Active
        </Button>
        <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => add("passive")}>
          <Plus className="h-3 w-3" /> Passive
        </Button>
      </div>

      <PhaseBar phases={phases} />
      <PhaseLegend />
      <p className="text-xs text-muted-foreground">
        Total {formatMinutes(totals.total)}: {formatMinutes(totals.active)} active, {formatMinutes(totals.passive)} passive.
        Other clients can be booked into the passive time, as long as their active time does not overlap another active time.
      </p>
    </div>
  );
}
