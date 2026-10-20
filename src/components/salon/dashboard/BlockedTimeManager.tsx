import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import type { TeamMember } from "../../types";
import { createBlockedTime, deleteBlockedTime, type BlockedTime } from "../../../helpers/bookingHelpers";
import { getErrorMessage } from "../../../helpers/errors";
import { dateStringInZone, zonedToUtcMs } from "../../../helpers/timezone";

interface Props {
  blocks: BlockedTime[];
  team: TeamMember[];
  timezone: string;
  date: string; // pre-filled from the schedule date picker
  onChanged: () => void;
}

const when = (iso: string, timeZone: string) =>
  new Date(iso).toLocaleString([], { timeZone, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** Lunch breaks, a day off, a holiday: time that customers cannot book. */
export function BlockedTimeManager({ blocks, team, timezone, date, onChanged }: Props) {
  const [from, setFrom] = useState("12:00");
  const [to, setTo] = useState("13:00");
  const [endDate, setEndDate] = useState("");
  const [staffId, setStaffId] = useState("all");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const memberName = (id: number | null) => (id ? team.find((m) => Number(m.id) === id)?.name ?? "Team member" : "Whole salon");

  const add = async () => {
    setBusy(true);
    setError("");
    try {
      await createBlockedTime({
        startAt: new Date(zonedToUtcMs(date, from, timezone)).toISOString(),
        endAt: new Date(zonedToUtcMs(endDate || date, to, timezone)).toISOString(),
        teamMemberId: staffId === "all" ? undefined : Number(staffId),
        reason: reason || undefined,
      });
      setReason("");
      setEndDate("");
      onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not block that time."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    setError("");
    try {
      await deleteBlockedTime(id);
      onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Could not remove it."));
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">Block time</h3>
      <p className="text-sm text-muted-foreground">
        Breaks, days off or holidays. Customers cannot book blocked time. Appointments already in it must be moved or cancelled first.
      </p>
      <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-6">
        <div className="space-y-1">
          <Label>From ({date || dateStringInZone()})</Label>
          <Input type="time" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>To</Label>
          <Input type="time" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Until date (optional)</Label>
          <Input type="date" min={date} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="block-staff">Who</Label>
          <select id="block-staff" value={staffId} onChange={(e) => setStaffId(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
            <option value="all">Whole salon</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label>Reason</Label>
          <Input value={reason} maxLength={150} placeholder="Lunch, vacation..." onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        The time range starts on the date picked above the schedule. For a multi-day block set an end date, e.g. 09:00 to 18:00 across several days blocks the whole stretch.
      </p>
      <Button onClick={add} disabled={busy || !date}>Block time</Button>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      {blocks.length > 0 && (
        <ul className="space-y-2">
          {blocks.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span>
                <strong>{memberName(b.teamMemberId)}</strong>: {when(b.startAt, timezone)} – {when(b.endAt, timezone)}
                {b.reason ? ` · ${b.reason}` : ""}
              </span>
              <Button size="sm" variant="ghost" aria-label="Remove blocked time" onClick={() => remove(b.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
