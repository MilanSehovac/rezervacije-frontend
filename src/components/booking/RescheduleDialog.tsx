import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { getSalonAvailability, rescheduleBooking, type AvailabilitySlot } from "../../helpers/bookingHelpers";
import { getErrorMessage } from "../../helpers/errors";
import { formatTime } from "../../helpers/phases";
import { DEFAULT_TIMEZONE, dateStringInZone } from "../../helpers/timezone";

export type ReschedulableBooking = {
  id: number;
  salonId: number;
  serviceId: number;
  startAt: string;
  Salon?: { businessName?: string; timezone?: string };
  service?: { name?: string };
};

interface Props {
  booking: ReschedulableBooking | null;
  onClose: () => void;
  onMoved: () => void;
}

export function RescheduleDialog({ booking, onClose, onMoved }: Props) {
  const tz = booking?.Salon?.timezone || DEFAULT_TIMEZONE;
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDate(booking ? dateStringInZone(new Date(booking.startAt).getTime(), tz) : "");
    setSelected("");
    setError("");
  }, [booking, tz]);

  useEffect(() => {
    if (!booking || !date) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    getSalonAvailability(booking.salonId, booking.serviceId, date, undefined, booking.id)
      .then((res) => !cancelled && (setSlots(res.slots ?? []), setSelected("")))
      .catch((e) => !cancelled && (setSlots([]), setError(getErrorMessage(e, "Could not load free times."))))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [booking, date]);

  const save = async () => {
    if (!booking || !selected) return;
    setSaving(true);
    setError("");
    try {
      await rescheduleBooking(booking.id, selected);
      onMoved();
      onClose();
    } catch (e) {
      setError(getErrorMessage(e, "Could not move the booking."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move your appointment</DialogTitle>
          <DialogDescription>
            {booking?.service?.name} at {booking?.Salon?.businessName}. Pick a new day and time. The salon may need to confirm the new time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input type="date" aria-label="New date" min={dateStringInZone(Date.now(), tz)} value={date} onChange={(e) => setDate(e.target.value)} />

          {loading && <p className="text-sm text-muted-foreground">Loading free times...</p>}
          {!loading && slots.length === 0 && date && !error && (
            <p className="text-sm text-muted-foreground">No free times on this day.</p>
          )}
          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto">
            {slots.map((slot) => (
              <Button
                key={slot.startAt}
                type="button"
                size="sm"
                variant={selected === slot.startAt ? "default" : "outline"}
                onClick={() => setSelected(slot.startAt)}
              >
                {formatTime(slot.startAt, tz)}
              </Button>
            ))}
          </div>
          {slots.length > 0 && <p className="text-xs text-muted-foreground">Times are shown in {tz}.</p>}
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Keep current time</Button>
          <Button onClick={save} disabled={!selected || saving}>{saving ? "Saving…" : "Move appointment"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
