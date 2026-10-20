import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import type { SalonProfile } from "../../types";
import { getErrorMessage } from "../../../helpers/errors";
import { deleteSalonImage, updateMySalon, uploadSalonImages } from "../../../helpers/salonHelpers";
import { DEFAULT_TIMEZONE } from "../../../helpers/timezone";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface Props {
  salon: SalonProfile;
  onChanged: () => Promise<void> | void;
}

export function SettingsManager({ salon, onChanged }: Props) {
  const [hours, setHours] = useState(() =>
    Object.fromEntries(DAYS.map((d) => [d, salon.daysOfOperation?.[d] ?? { enabled: false, open: "09:00", close: "17:00" }]))
  );
  const [timezone, setTimezone] = useState(salon.timezone || DEFAULT_TIMEZONE);
  const [autoConfirm, setAutoConfirm] = useState(!!salon.autoConfirm);
  const [minNotice, setMinNotice] = useState(String(salon.minNoticeHours ?? 1));
  const [cancellation, setCancellation] = useState(String(salon.cancellationHours ?? 0));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const zones = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [DEFAULT_TIMEZONE];
  const invalid = DAYS.some((d) => hours[d].enabled && hours[d].open >= hours[d].close);

  const setDay = (day: string, patch: Partial<{ enabled: boolean; open: string; close: string }>) =>
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));

  const run = async (action: () => Promise<unknown>, success: string) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
      await onChanged();
    } catch (e) {
      setError(getErrorMessage(e, "Something went wrong."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <section className="space-y-4">
        <h3 className="font-semibold">Opening hours</h3>
        <div className="space-y-2">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-wrap items-center gap-4">
              <div className="flex w-36 items-center gap-2">
                <Switch checked={hours[day].enabled} onCheckedChange={(v) => setDay(day, { enabled: v })} />
                <Label className="capitalize">{day}</Label>
              </div>
              {hours[day].enabled ? (
                <div className="flex items-center gap-2">
                  <Input type="time" value={hours[day].open} onChange={(e) => setDay(day, { open: e.target.value })} className="w-32" />
                  <span className="text-muted-foreground">to</span>
                  <Input type="time" value={hours[day].close} onChange={(e) => setDay(day, { close: e.target.value })} className="w-32" />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Closed</span>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <Label htmlFor="tz">Timezone</Label>
          <Input id="tz" list="timezones" value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-72" />
          <datalist id="timezones">{zones.map((z) => <option key={z} value={z} />)}</datalist>
          <p className="text-xs text-muted-foreground">Opening hours and booking times use this timezone.</p>
        </div>
        {invalid && <p className="text-sm text-destructive">Closing time must be after opening time.</p>}
        <Button disabled={busy || invalid} onClick={() => run(() => updateMySalon({ daysOfOperation: hours, timezone }), "Saved")}>
          Save hours
        </Button>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold">Booking rules</h3>
        <label className="flex items-center gap-3 text-sm">
          <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
          <span>
            Confirm bookings automatically
            <span className="block text-xs text-muted-foreground">Off: every booking waits for you to confirm or decline it.</span>
          </span>
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="min-notice">Minimum notice (hours)</Label>
            <Input id="min-notice" type="number" min={0} max={720} value={minNotice} onChange={(e) => setMinNotice(e.target.value)} className="w-32" />
            <p className="text-xs text-muted-foreground">Customers cannot book closer to the start than this.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="cancel-window">Free cancellation / changes until (hours before)</Label>
            <Input id="cancel-window" type="number" min={0} max={720} value={cancellation} onChange={(e) => setCancellation(e.target.value)} className="w-32" />
            <p className="text-xs text-muted-foreground">0 means customers can cancel or move a booking any time.</p>
          </div>
        </div>
        <Button
          disabled={busy || minNotice === "" || cancellation === ""}
          onClick={() => run(() => updateMySalon({ autoConfirm, minNoticeHours: Number(minNotice), cancellationHours: Number(cancellation) }), "Booking rules saved")}
        >
          Save booking rules
        </Button>
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold">Photos</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {(salon.images ?? []).map((url) => (
            <div key={url} className="relative overflow-hidden rounded-lg border">
              <img src={url} alt="" className="h-32 w-full object-cover" />
              <Button size="sm" variant="destructive" className="absolute right-1 top-1 opacity-90" aria-label="Remove photo"
                disabled={busy} onClick={() => run(() => deleteSalonImage(url), "Photo removed")}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) run(() => uploadSalonImages(files), "Photos uploaded");
          }} />
        <Button variant="outline" className="gap-2" disabled={busy} onClick={() => fileInput.current?.click()}>
          <ImagePlus className="h-4 w-4" /> Add photos
        </Button>
        <p className="text-xs text-muted-foreground">JPEG, PNG or WebP, up to 5 MB each, 10 photos in total.</p>
      </section>
    </div>
  );
}
