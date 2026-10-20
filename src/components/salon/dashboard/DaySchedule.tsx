import { useMemo } from "react";
import type { BlockedTime, SalonBooking } from "../../../helpers/bookingHelpers";
import type { TeamMember } from "../../types";
import { PhaseLegend } from "../PhaseBar";
import { formatTime } from "../../../helpers/phases";
import { DEFAULT_TIMEZONE, zonedToUtcMs } from "../../../helpers/timezone";

interface Props {
  bookings: SalonBooking[];
  team: TeamMember[];
  date: string; // YYYY-MM-DD
  hours?: { enabled: boolean; open: string; close: string } | null;
  timezone?: string;
  blocks?: BlockedTime[];
}

const HIDDEN_STATUSES = ["cancelled", "no_show"];
const IMPLICIT_STAFF_ID = 0;
const order = { passive: 0, active: 1, blocked: 2 } as const;

type Block = {
  key: string;
  type: "active" | "passive" | "blocked";
  start: number;
  end: number;
  label: string;
  title: string;
};

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * One row per staff member. A booking's passive time is drawn as a hatched strip underneath,
 * its active time as solid blocks on top, so other clients' active blocks visibly sit inside it.
 */
export function DaySchedule({ bookings, team, date, hours, timezone = DEFAULT_TIMEZONE, blocks = [] }: Props) {
  const { rows, from, to } = useMemo(() => {
    const dayStart = zonedToUtcMs(date, "00:00", timezone);
    const dayEnd = zonedToUtcMs(date, "23:59", timezone) + 60 * 1000;

    const staffRows: Array<{ id: number; name: string; blocks: Block[] }> =
      team.length > 0
        ? team.map((m) => ({ id: Number(m.id), name: m.name, blocks: [] }))
        : [{ id: IMPLICIT_STAFF_ID, name: "Salon", blocks: [] }];
    const unassigned = { id: -1, name: "Unassigned", blocks: [] as Block[] };

    let min = hours?.enabled ? toMin(hours.open) : 9 * 60;
    let max = hours?.enabled ? toMin(hours.close) : 18 * 60;

    for (const booking of bookings) {
      if (HIDDEN_STATUSES.includes(booking.status)) continue;
      const startMs = new Date(booking.startAt).getTime();
      if (startMs < dayStart || startMs >= dayEnd) continue;

      const phases = booking.schedule?.phases?.length
        ? booking.schedule.phases
        : [{ type: "active" as const, duration: Math.round((new Date(booking.endAt).getTime() - startMs) / 60000) }];
      const staffIds = booking.schedule?.staffIds;
      const customer = booking.customer ? `${booking.customer.firstName ?? ""} ${booking.customer.lastName ?? ""}`.trim() : "Customer";

      let cursor = (startMs - dayStart) / 60000;
      phases.forEach((phase, i) => {
        const block: Block = {
          key: `${booking.id}-${i}`,
          type: phase.type,
          start: cursor,
          end: cursor + phase.duration,
          label: phase.type === "active" ? `${customer} · ${booking.service?.name ?? ""}` : "",
          title: `${customer} – ${booking.service?.name ?? ""}\n${phase.type === "active" ? "Active" : "Passive"} ${formatTime(dayStart + cursor * 60000, timezone)}–${formatTime(dayStart + (cursor + phase.duration) * 60000, timezone)}\nStatus: ${booking.status}`,
        };
        cursor += phase.duration;
        min = Math.min(min, Math.floor(block.start / 60) * 60);
        max = Math.max(max, Math.ceil(block.end / 60) * 60);

        // known staff -> their rows; unknown (legacy bookings) -> every row
        const targets = Array.isArray(staffIds) && staffIds.length
          ? staffRows.filter((r) => staffIds.includes(r.id))
          : staffRows;
        if (targets.length === 0) unassigned.blocks.push(block);
        else targets.forEach((r) => r.blocks.push(block));
      });
    }

    // breaks and days off: one staff member, or every row
    for (const block of blocks) {
      const startMs = new Date(block.startAt).getTime();
      const endMs = new Date(block.endAt).getTime();
      if (endMs <= dayStart || startMs >= dayEnd) continue;
      const start = Math.max(0, (startMs - dayStart) / 60000);
      const end = Math.min(24 * 60, (endMs - dayStart) / 60000);
      const item: Block = {
        key: `block-${block.id}`,
        type: "blocked",
        start,
        end,
        label: block.reason || "Blocked",
        title: `Blocked${block.reason ? `: ${block.reason}` : ""}\n${formatTime(startMs, timezone)}–${formatTime(endMs, timezone)}`,
      };
      min = Math.min(min, Math.floor(start / 60) * 60);
      max = Math.max(max, Math.ceil(end / 60) * 60);
      const targets = block.teamMemberId ? staffRows.filter((r) => r.id === block.teamMemberId) : staffRows;
      targets.forEach((r) => r.blocks.push(item));
    }

    return {
      rows: unassigned.blocks.length ? [...staffRows, unassigned] : staffRows,
      from: min,
      to: Math.max(max, min + 60),
    };
  }, [bookings, team, date, hours, timezone, blocks]);

  const span = to - from;
  const hourMarks: number[] = [];
  for (let m = Math.ceil(from / 60) * 60; m <= to; m += 60) hourMarks.push(m);

  return (
    <div className="space-y-3">
      <PhaseLegend />
      <div className="overflow-x-auto">
        <div className="min-w-[640px] space-y-2">
          <div className="relative ml-28 h-5 text-xs text-muted-foreground">
            {hourMarks.map((m) => (
              <span key={m} className="absolute -translate-x-1/2" style={{ left: `${((m - from) / span) * 100}%` }}>
                {String(Math.floor(m / 60)).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.id} className="flex items-stretch gap-2">
              <div className="w-[6.5rem] shrink-0 truncate pt-3 text-sm font-medium" title={row.name}>{row.name}</div>
              <div className="relative h-14 flex-1 rounded-md border bg-muted/30">
                {hourMarks.map((m) => (
                  <div key={m} className="absolute top-0 h-full border-l border-dashed border-border/70" style={{ left: `${((m - from) / span) * 100}%` }} />
                ))}
                {/* passive strips first (below), active blocks after (on top) */}
                {[...row.blocks].sort((a, b) => order[a.type] - order[b.type]).map((b) => (
                  <div
                    key={b.key}
                    title={b.title}
                    className={
                      b.type === "blocked"
                        ? "absolute top-1 z-20 flex h-12 items-center overflow-hidden rounded border border-gray-400 bg-gray-200 px-1 text-[11px] leading-tight text-gray-700 [background-image:repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(0,0,0,0.12)_5px,rgba(0,0,0,0.12)_10px)]"
                        : b.type === "active"
                        ? "absolute top-1 z-10 flex h-12 items-center overflow-hidden rounded bg-primary px-1 text-[11px] leading-tight text-primary-foreground shadow"
                        : "absolute top-1 z-0 h-12 rounded border border-amber-300 bg-amber-100 [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.08)_4px,rgba(0,0,0,0.08)_8px)]"
                    }
                    style={{ left: `${((b.start - from) / span) * 100}%`, width: `${((b.end - b.start) / span) * 100}%` }}
                  >
                    <span className="truncate">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
