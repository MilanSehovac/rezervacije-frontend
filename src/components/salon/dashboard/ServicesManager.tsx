import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { PhaseEditor } from "../PhaseEditor";
import { PhaseBar } from "../PhaseBar";
import type { SalonService, ServicePhase } from "../../types";
import { formatMinutes, getPhases, getTotals } from "../../../helpers/phases";
import { getErrorMessage } from "../../../helpers/errors";
import { addService, deleteService, updateMySalon, updateService } from "../../../helpers/salonHelpers";

interface Props {
  services: SalonService[];
  seats: number | null;
  onChanged: () => Promise<void> | void;
}

type Draft = {
  id?: SalonService["id"];
  name: string;
  price: number;
  phases: ServicePhase[];
  canOverlap: boolean;
  requiredStaff: number;
};

const emptyDraft = (): Draft => ({
  name: "",
  price: 20,
  phases: [{ type: "active", duration: 30 }],
  canOverlap: false,
  requiredStaff: 1,
});


export function ServicesManager({ services, seats, onChanged }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [seatsValue, setSeatsValue] = useState<string>(seats ? String(seats) : "");
  const [seatsSaved, setSeatsSaved] = useState(false);

  const edit = (s: SalonService) =>
    setDraft({
      id: s.id,
      name: s.name,
      price: Number(s.price),
      phases: getPhases(s),
      canOverlap: !!s.canOverlap,
      requiredStaff: s.requiredStaff || 1,
    });

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: draft.name,
        price: draft.price,
        phases: draft.phases,
        canOverlap: draft.canOverlap,
        requiredStaff: draft.requiredStaff,
      };
      if (draft.id !== undefined) await updateService(draft.id, payload);
      else await addService(payload);
      setDraft(null);
      await onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not save the service."));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s: SalonService) => {
    if (!window.confirm(`Remove "${s.name}"? Existing bookings are kept.`)) return;
    setError("");
    try {
      await deleteService(s.id);
      await onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not remove the service."));
    }
  };

  const saveSeats = async () => {
    setError("");
    setSeatsSaved(false);
    try {
      await updateMySalon({ seats: seatsValue === "" ? null : Number(seatsValue) });
      setSeatsSaved(true);
      await onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not save seats."));
    }
  };

  const activeServices = services.filter((s) => s.isActive !== false);
  const hasPassive = draft ? getTotals(draft.phases).passive > 0 : false;

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      <div className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="seats">Seats / stations</Label>
          <Input id="seats" type="number" min={1} placeholder="Unlimited" value={seatsValue}
            onChange={(e) => { setSeatsValue(e.target.value); setSeatsSaved(false); }} className="w-40" />
        </div>
        <Button variant="outline" onClick={saveSeats}>Save</Button>
        {seatsSaved && <span className="text-sm text-green-600">Saved</span>}
        <p className="basis-full text-xs text-muted-foreground">
          How many clients can be in the salon at once. A client keeps a seat during passive time too. Leave empty for no limit.
        </p>
      </div>

      <div className="space-y-3">
        {activeServices.map((s) => {
          const phases = getPhases(s);
          const totals = getTotals(phases);
          return (
            <div key={s.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 md:w-1/2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{s.name}</span>
                  {s.canOverlap && totals.passive > 0 && <Badge variant="secondary">Shares passive time</Badge>}
                </div>
                <PhaseBar phases={phases} />
                <p className="text-xs text-muted-foreground">
                  {formatMinutes(totals.total)} total · {formatMinutes(totals.active)} active · {formatMinutes(totals.passive)} passive · ${Number(s.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => edit(s)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(s)}>Remove</Button>
              </div>
            </div>
          );
        })}
        {activeServices.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
      </div>

      {draft ? (
        <div className="space-y-4 rounded-lg border-2 border-primary/30 p-4">
          <h3 className="font-semibold">{draft.id !== undefined ? "Edit service" : "New service"}</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
              <Label>Name</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Price</Label>
              <Input type="number" min={0} value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Math.max(0, Number(e.target.value) || 0) })} />
            </div>
          </div>
          <PhaseEditor
            phases={draft.phases}
            onChange={(phases) => {
              const gainedPassive = getTotals(phases).passive > 0 && !hasPassive;
              setDraft({ ...draft, phases, canOverlap: gainedPassive ? true : getTotals(phases).passive > 0 ? draft.canOverlap : false });
            }}
          />
          {hasPassive && (
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={draft.canOverlap} onCheckedChange={(v) => setDraft({ ...draft, canOverlap: v })} />
              Take other clients during the passive time
            </label>
          )}
          <div className="space-y-1">
            <Label>Staff needed at the same time</Label>
            <Input type="number" min={1} max={10} value={draft.requiredStaff} className="w-28"
              onChange={(e) => setDraft({ ...draft, requiredStaff: Math.min(10, Math.max(1, Number(e.target.value) || 1)) })} />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving || !draft.name.trim() || getTotals(draft.phases).active <= 0}>
              {saving ? "Saving…" : "Save service"}
            </Button>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button className="gap-2" onClick={() => setDraft(emptyDraft())}>
          <Plus className="h-4 w-4" /> Add service
        </Button>
      )}
    </div>
  );
}
