import instance from "../config/AxiosConfig";

export type AppNotification = {
  id: number;
  type: string;
  title: string;
  message: string;
  bookingId: number | null;
  salonId: number | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPrefs = { reminders: boolean; statusUpdates: boolean };

export const getNotifications = async (): Promise<{ unreadCount: number; notifications: AppNotification[] }> => {
  const res = await instance.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id: number) => {
  await instance.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  await instance.post("/notifications/read-all");
};

export const updateNotificationPrefs = async (prefs: Partial<NotificationPrefs>): Promise<NotificationPrefs> => {
  const res = await instance.put("/users/me/notifications", prefs);
  return res.data.notificationPrefs;
};

/** Notifications addressed to a salon owner open the dashboard, the rest open the customer's bookings. */
export const notificationLink = (type: string) =>
  type === "booking_requested" || type === "booking_cancelled_by_customer" ? "/salon/dashboard" : "/profile?tab=bookings";
