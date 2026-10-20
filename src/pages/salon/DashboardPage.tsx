import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import { useAuth } from '../../components/context/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  getSalonBookings,
  updateBookingStatus,
  type BookingStatus,
  type SalonBooking,
  type BlockedTime,
  getBlockedTimes,
} from '../../helpers/bookingHelpers';
import { getMySalon } from '../../helpers/salonHelpers';
import LoadingSpinner from '../../components/ui/loadingSpinner';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { BookingsTab } from '../../components/salon/dashboard/BookingsTab';
import { ManualBookingDialog } from '../../components/salon/dashboard/ManualBookingDialog';
import { BlockedTimeManager } from '../../components/salon/dashboard/BlockedTimeManager';
import { DaySchedule } from '../../components/salon/dashboard/DaySchedule';
import { ServicesManager } from '../../components/salon/dashboard/ServicesManager';
import { SettingsManager } from '../../components/salon/dashboard/SettingsManager';
import { TeamManager } from '../../components/salon/dashboard/TeamManager';
import { dateStringInZone, weekdayKey, DEFAULT_TIMEZONE } from '../../helpers/timezone';
import { getErrorMessage } from '../../helpers/errors';
import type { SalonProfile } from '../../components/types';


const DashboardPage = () => {
  const { salon } = useAuth();
  const [bookings, setBookings] = useState<SalonBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [fullSalon, setFullSalon] = useState<SalonProfile | null>(null);
  const [scheduleDate, setScheduleDate] = useState(dateStringInZone());
  const [blocks, setBlocks] = useState<BlockedTime[]>([]);
  const [addingBooking, setAddingBooking] = useState(false);

  const fetchSalon = useCallback(async () => {
    try {
      setFullSalon(await getMySalon());
    } catch (err) {
      console.error(err);
      setError('Could not load salon settings.');
    }
  }, []);

  const fetchBlocks = useCallback(async () => {
    try {
      setBlocks(await getBlockedTimes());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getSalonBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError('Could not load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (salon) {
      fetchBookings();
      fetchSalon();
      fetchBlocks();
      // new booking requests show up without a manual refresh
      const timer = setInterval(() => {
        getSalonBookings().then(setBookings).catch(() => {});
      }, 30_000);
      return () => clearInterval(timer);
    } else {
      setLoading(false);
    }
  }, [salon, fetchBookings, fetchSalon, fetchBlocks]);

  const timezone = fullSalon?.timezone ?? DEFAULT_TIMEZONE;

  const stats = useMemo(() => {
    const today = dateStringInZone(Date.now(), timezone);
    const todayCount = bookings.filter(
      (b) => dateStringInZone(new Date(b.startAt).getTime(), timezone) === today && b.status !== 'cancelled' && b.status !== 'no_show'
    ).length;
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    return { todayCount, pendingCount, total: bookings.length };
  }, [bookings, timezone]);

  const handleStatusUpdate = async (bookingId: number, status: BookingStatus) => {
    try {
      setUpdatingId(bookingId);
      setError('');
      await updateBookingStatus(bookingId, status);
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, 'Could not update booking status.'));
    } finally {
      setUpdatingId(null);
    }
  };

  if (!salon) {
    return (
      <Card className="border-0 shadow-lg max-w-lg mx-auto">
        <CardContent className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gradient-primary">No salon yet</h1>
          <p className="text-muted-foreground">
            List your salon to start receiving and managing bookings.
          </p>
          <Button asChild className="bg-gradient-primary">
            <Link to="/salon/create">List My Salon</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary">{salon.businessName}</h1>
        <p className="text-muted-foreground">Manage your appointments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold">{stats.todayCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total bookings</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bookings" className="cursor-pointer">Bookings</TabsTrigger>
          <TabsTrigger value="schedule" className="cursor-pointer">Day schedule</TabsTrigger>
          <TabsTrigger value="services" className="cursor-pointer">Services</TabsTrigger>
          <TabsTrigger value="team" className="cursor-pointer">Team</TabsTrigger>
          <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4">
          <BookingsTab
            bookings={bookings}
            loading={loading}
            error={error}
            updatingId={updatingId}
            timezone={timezone}
            onStatus={handleStatusUpdate}
            onRefresh={fetchBookings}
            onAdd={() => setAddingBooking(true)}
          />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Day schedule</CardTitle>
              <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-44" />
            </CardHeader>
            <CardContent>
              <DaySchedule
                bookings={bookings}
                team={fullSalon?.teamMembers ?? []}
                date={scheduleDate}
                hours={fullSalon?.daysOfOperation?.[weekdayKey(scheduleDate)] ?? null}
                timezone={timezone}
                blocks={blocks}
              />
            </CardContent>
          </Card>
          <div className="mt-6">
            <BlockedTimeManager blocks={blocks} team={fullSalon?.teamMembers ?? []} timezone={timezone} date={scheduleDate} onChanged={() => { fetchBlocks(); fetchBookings(); }} />
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card className="border-0 shadow-lg">
            <CardHeader><CardTitle>Services</CardTitle></CardHeader>
            <CardContent>
              {fullSalon ? (
                <ServicesManager
                  key={fullSalon.seats ?? 'unlimited'}
                  services={fullSalon.services}
                  seats={fullSalon.seats ?? null}
                  onChanged={fetchSalon}
                />
              ) : (
                <LoadingSpinner loading singular={false} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="border-0 shadow-lg">
            <CardHeader><CardTitle>Team</CardTitle></CardHeader>
            <CardContent>
              {fullSalon ? <TeamManager team={fullSalon.teamMembers ?? []} onChanged={fetchSalon} /> : <LoadingSpinner loading singular={false} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card className="border-0 shadow-lg">
            <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
            <CardContent>
              {fullSalon ? (
                <SettingsManager key={JSON.stringify([fullSalon.daysOfOperation, fullSalon.timezone])} salon={fullSalon} onChanged={fetchSalon} />
              ) : (
                <LoadingSpinner loading singular={false} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ManualBookingDialog
        open={addingBooking}
        onClose={() => setAddingBooking(false)}
        services={fullSalon?.services ?? []}
        team={fullSalon?.teamMembers ?? []}
        timezone={timezone}
        onCreated={fetchBookings}
      />
    </div>
  );
};

export default DashboardPage;
