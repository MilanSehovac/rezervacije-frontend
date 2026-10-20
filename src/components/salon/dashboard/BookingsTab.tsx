import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import LoadingSpinner from "../../ui/loadingSpinner";
import { PhaseBar } from "../PhaseBar";
import type { BookingStatus, SalonBooking } from "../../../helpers/bookingHelpers";

type Filter = "upcoming" | "pending" | "past" | "cancelled" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "pending", label: "To confirm" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
  { id: "all", label: "All" },
];

interface Props {
  bookings: SalonBooking[];
  loading: boolean;
  error: string;
  updatingId: number | null;
  timezone: string;
  onStatus: (id: number, status: BookingStatus) => void;
  onRefresh: () => void;
  onAdd: () => void;
}

const customerName = (b: SalonBooking) =>
  b.customer ? `${b.customer.firstName ?? ""} ${b.customer.lastName ?? ""}`.trim() : b.guestName || "Customer";

const when = (iso: string, timeZone: string) =>
  new Date(iso).toLocaleString([], { timeZone, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function BookingsTab({ bookings, loading, error, updatingId, timezone, onStatus, onRefresh, onAdd }: Props) {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const now = Date.now();
    const open = (b: SalonBooking) => b.status === "pending" || b.status === "confirmed";
    return {
      upcoming: bookings.filter((b) => open(b) && new Date(b.endAt).getTime() > now).length,
      pending: bookings.filter((b) => b.status === "pending").length,
    };
  }, [bookings]);

  const visible = useMemo(() => {
    const now = Date.now();
    const open = (b: SalonBooking) => b.status === "pending" || b.status === "confirmed";
    const needle = search.trim().toLowerCase();
    const list = bookings.filter((b) => {
      if (needle && !`${customerName(b)} ${b.service?.name ?? ""} ${b.customer?.email ?? ""} ${b.guestPhone ?? ""}`.toLowerCase().includes(needle)) return false;
      switch (filter) {
        case "upcoming": return open(b) && new Date(b.endAt).getTime() > now;
        case "pending": return b.status === "pending";
        case "past": return b.status === "completed" || b.status === "no_show" || (open(b) && new Date(b.endAt).getTime() <= now);
        case "cancelled": return b.status === "cancelled";
        default: return true;
      }
    });
    // what is next comes first; history comes newest first
    const ascending = filter === "upcoming" || filter === "pending";
    return list.sort((a, b) => (ascending ? 1 : -1) * (new Date(a.startAt).getTime() - new Date(b.startAt).getTime()));
  }, [bookings, filter, search]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Bookings</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" className="gap-1" onClick={onAdd}>
            <Plus className="h-4 w-4" /> Add booking
          </Button>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <Button key={f.id} size="sm" variant={filter === f.id ? "default" : "outline"} onClick={() => setFilter(f.id)}>
              {f.label}
              {f.id === "pending" && counts.pending > 0 && <span className="ml-1 rounded-full bg-white/30 px-1.5 text-xs">{counts.pending}</span>}
              {f.id === "upcoming" && counts.upcoming > 0 && <span className="ml-1 text-xs opacity-70">({counts.upcoming})</span>}
            </Button>
          ))}
          <Input type="search" aria-label="Search bookings" placeholder="Search name, service, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="ml-auto w-64" />
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        {loading && bookings.length === 0 && <LoadingSpinner loading singular={false} />}
        {!loading && visible.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}

        {visible.map((booking) => {
          const started = new Date(booking.startAt).getTime() <= Date.now();
          const busy = updatingId === booking.id;
          return (
            <Card key={booking.id} className="border shadow-sm">
              <CardContent className="flex flex-col justify-between gap-4 p-4 lg:flex-row lg:items-center">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{customerName(booking)}</span>
                    <Badge variant="secondary">{booking.status}</Badge>
                    {booking.source === "manual" && <Badge variant="outline">Walk-in / phone</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.service?.name || "Service"} · {booking.customer?.email || booking.guestPhone || "no contact"}
                    {booking.customer?.phoneNumber ? ` · ${booking.customer.phoneNumber}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">{when(booking.startAt, timezone)}</p>
                  {booking.schedule?.phases && booking.schedule.phases.length > 1 && <PhaseBar phases={booking.schedule.phases} className="mt-1 w-56" />}
                  {booking.note && <p className="text-sm italic text-muted-foreground">“{booking.note}”</p>}
                  {booking.totalPrice != null && <p className="text-sm font-medium">${Number(booking.totalPrice).toFixed(2)}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking.status === "pending" && (
                    <Button size="sm" disabled={busy} onClick={() => onStatus(booking.id, "confirmed")}>Confirm</Button>
                  )}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <>
                      <Button size="sm" variant="outline" disabled={busy || !started} title={!started ? "Available once the appointment has started" : undefined} onClick={() => onStatus(booking.id, "completed")}>
                        Complete
                      </Button>
                      {started && (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => onStatus(booking.id, "no_show")}>No-show</Button>
                      )}
                      <Button size="sm" variant="destructive" disabled={busy} onClick={() => onStatus(booking.id, "cancelled")}>
                        {booking.status === "pending" ? "Decline" : "Cancel"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
