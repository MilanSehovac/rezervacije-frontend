export const DEFAULT_TIMEZONE = "Europe/Sarajevo";

const parts = (ms: number, tz: string) => {
  const out: Record<string, number> = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(ms)).forEach((p) => {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  });
  return out;
};

const offset = (ms: number, tz: string) => {
  const p = parts(ms, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
};

/** Wall-clock time in `tz` -> UTC ms. */
export const zonedToUtcMs = (dateStr: string, hhmm: string, tz: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = guess - offset(guess, tz);
  return guess - offset(first, tz);
};

/** YYYY-MM-DD of an instant as seen in `tz`. */
export const dateStringInZone = (ms: number = Date.now(), tz: string = DEFAULT_TIMEZONE) => {
  const p = parts(ms, tz);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
};

/** Weekday key (sunday..saturday) of a calendar date, independent of any timezone. */
export const weekdayKey = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
};

export const formatTimeInZone = (iso: string | number | Date, tz: string = DEFAULT_TIMEZONE) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: tz });

/** Is the salon open at this moment, judged in its own timezone? */
export const isOpenNow = (
  daysOfOperation: Record<string, { enabled: boolean; open: string; close: string }> | undefined,
  tz: string = DEFAULT_TIMEZONE,
  now: number = Date.now()
) => {
  const date = dateStringInZone(now, tz);
  const day = daysOfOperation?.[weekdayKey(date)];
  if (!day || !day.enabled) return false;
  return now >= zonedToUtcMs(date, day.open, tz) && now < zonedToUtcMs(date, day.close, tz);
};
