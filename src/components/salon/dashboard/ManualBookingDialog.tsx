import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import type { SalonService, TeamMember } from "../../types";
import { createManualBooking } from "../../../helpers/bookingHelpers";
import { getErrorMessage } from "../../../helpers/errors";
import { dateStringInZone, zonedToUtcMs } from "../../../helpers/timezone";
import { getPhases, getTotals, formatMinutes } from "../../../helpers/phases";

interface Props {
  open: boolean;
  onClose: () => void;
  services: SalonService[];
  team: TeamMember[];
  timezone: string;
  onCreated: () => void;
}

const nextQuarter = () => {
  const d = new Date(Date.now() + 15 * 60 * 1000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return d;
};

/** Entering a walk-in or phone booking for someone without an account. */
export function ManualBookingDialog({ open, onClose, services, team, timezone, onCreated }: Props) {
  const activeServices = services.filter((s) => s.isActive !== false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const t = nextQuarter();
    setDate(dateStringInZone(t.getTime(), timezone));
    setTime(t.toLocaleTimeString("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit" }));
    setServiceId(activeServices[0] ? String(activeServices[0].id) : "");
    setGuestName("");
    setGuestPhone("");
    setStaffId("any");
    setNote("");
    setError("");
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const service = activeServices.find((s) => String(s.id) === serviceId);

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await createManualBooking({
        serviceId: Number(serviceId),
        startAt: new Date(zonedToUtcMs(date, time, timezone)).toISOString(),
        guestName,
        guestPhone: guestPhone || undefined,
        note: note || undefined,
        staffId: staffId === "any" ? undefined : Number(staffId),
      });
      onCreated();
      onClose();
    } catch (e) {
      setError(getErrorMessage(e, "Could not add the booking."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add booking</DialogTitle>
          <DialogDescription>For a walk-in or a phone call. It is confirmed straight away and blocks the time like any other booking.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="guest-name">Customer name *</Label>
              <Input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="guest-phone">Phone</Label>
              <Input id="guest-phone" type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="manual-service">Service *</Label>
            <select id="manual-service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
              {activeServices.map((s) => (
                <option key={s.id} value={s.id}>{s.name} (${Number(s.price)})</option>
              ))}
            </select>
            {service && <p className="text-xs text-muted-foreground">Takes {formatMinutes(getTotals(getPhases(service)).total)} in total.</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="manual-date">Date *</Label>
              <Input id="manual-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="manual-time">Start time *</Label>
              <Input id="manual-time" type="time" step={300} value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          {team.length > 0 && (
            <div className="space-y-1">
              <Label htmlFor="manual-staff">Team member</Label>
              <select id="manual-staff" value={staffId} onChange={(e) => setStaffId(e.target.value)} className="h-9 w-full rounded-md border bg-background px-2 text-sm">
                <option value="any">Anyone free</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="manual-note">Note</Label>
            <Input id="manual-note" value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} />
          </div>

          <p className="text-xs text-muted-foreground">Times are in the salon timezone ({timezone}).</p>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving || !guestName.trim() || !serviceId || !date || !time}>{saving ? "Saving…" : "Add booking"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
