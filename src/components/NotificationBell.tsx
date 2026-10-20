import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationLink,
  type AppNotification,
} from "../helpers/notificationHelpers";

const POLL_MS = 30_000;

const timeAgo = (iso: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(iso).toLocaleDateString();
};

export function NotificationBell() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await getNotifications();
      setItems(data.notifications);
      setUnread(data.unreadCount);
    } catch {
      // keep the previous list; the next poll will retry
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  const open = async (n: AppNotification) => {
    if (!n.readAt) {
      await markNotificationRead(n.id).catch(() => {});
      load();
    }
    navigate(notificationLink(n.type));
  };

  return (
    <DropdownMenu onOpenChange={(isOpen) => isOpen && load()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center p-0 px-1 text-xs">
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unread > 0 && (
            <button
              type="button"
              className="cursor-pointer text-xs font-normal text-primary hover:underline"
              onClick={async () => {
                await markAllNotificationsRead().catch(() => {});
                load();
              }}
            >
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">You are all caught up.</p>}
          {items.map((n) => (
            <DropdownMenuItem key={n.id} onClick={() => open(n)} className="flex cursor-pointer flex-col items-start gap-1 whitespace-normal">
              <div className="flex w-full items-center gap-2">
                {!n.readAt && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="unread" />}
                <span className="text-sm font-medium">{n.title}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{n.message}</p>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
