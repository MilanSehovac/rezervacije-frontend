import instance from "../config/AxiosConfig";

export type CreateBookingRequest = {
  salonId: number;
  serviceId: number;
  startAt: string;
  note?: string;
  staffId?: number;
};

export type SlotPhase = { type: 'active' | 'passive'; startAt: string; endAt: string };
export type AvailabilitySlot = { startAt: string; endAt: string; phases: SlotPhase[]; staffIds: number[] };

export const createBooking = async (payload: CreateBookingRequest) => {
  const res = await instance.post('/bookings', payload);
  return res.data;
};
export const getMyBookings = async () => {
  const res = await instance.get('/bookings/me');
  return res.data;
};

export const getSalonAvailability = async (salonId: number, serviceId: number, date: string, staffId?: number, excludeBookingId?: number) => {
  const res = await instance.get(`/salon/${salonId}/availability`, {
    params: {
      serviceId,
      date,
      ...(staffId !== undefined ? { staffId } : {}),
      // while moving a booking, its own current slot must not count as taken
      ...(excludeBookingId !== undefined ? { excludeBookingId } : {}),
    },
  });
  return res.data;
};

export const cancelBooking = async (id: number) => {
  const res = await instance.patch(`/bookings/${id}/cancel`);
  return res.data;
};

export const getSalonBookings = async () => {
  const res = await instance.get('/bookings/salon');
  return res.data;
};

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type SalonBooking = {
  id: number;
  status: BookingStatus;
  startAt: string;
  endAt: string;
  totalPrice: number | string;
  note?: string | null;
  source?: 'online' | 'manual';
  guestName?: string | null;
  guestPhone?: string | null;
  // snapshot taken at booking time: which phases, which staff
  schedule?: {
    phases: Array<{ type: 'active' | 'passive'; duration: number }>;
    staffIds: number[];
    canOverlap: boolean;
  } | null;
  service?: { name?: string };
  customer?: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string } | null;
};

export const updateBookingStatus = async (id: number, status: BookingStatus) => {
  const res = await instance.patch(`/bookings/${id}/status`, { status });
  return res.data;
};

export type Review = { id: number; rating: number; comment: string | null; createdAt: string; author: string };

export const getSalonReviews = async (salonId: number | string): Promise<Review[]> => {
  const res = await instance.get(`/salon/${salonId}/reviews`);
  return res.data;
};

export const createReview = async (bookingId: number, payload: { rating: number; comment?: string }) => {
  const res = await instance.post(`/bookings/${bookingId}/review`, payload);
  return res.data;
};


export const rescheduleBooking = async (id: number, startAt: string, staffId?: number) => {
  const res = await instance.patch(`/bookings/${id}/reschedule`, { startAt, ...(staffId !== undefined ? { staffId } : {}) });
  return res.data;
};

export type ManualBookingRequest = {
  serviceId: number;
  startAt: string;
  guestName: string;
  guestPhone?: string;
  note?: string;
  staffId?: number;
};

export const createManualBooking = async (payload: ManualBookingRequest) => {
  const res = await instance.post('/bookings/salon/manual', payload);
  return res.data;
};

export type BlockedTime = {
  id: number;
  teamMemberId: number | null;
  startAt: string;
  endAt: string;
  reason: string | null;
};

export const getBlockedTimes = async (): Promise<BlockedTime[]> => (await instance.get('/salon/me/blocked')).data;

export const createBlockedTime = async (payload: { startAt: string; endAt: string; teamMemberId?: number; reason?: string }) =>
  (await instance.post('/salon/me/blocked', payload)).data as BlockedTime;

export const deleteBlockedTime = async (id: number) => {
  await instance.delete(`/salon/me/blocked/${id}`);
};
