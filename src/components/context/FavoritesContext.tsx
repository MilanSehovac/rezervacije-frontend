import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { addFavorite, getFavoriteIds, removeFavorite } from "../../helpers/favoriteHelpers";

type FavoritesContextType = {
  /** false for guests and salon owners/admins: the heart is not shown */
  enabled: boolean;
  isFavorite: (salonId: number | string) => boolean;
  toggle: (salonId: number | string) => Promise<void>;
  count: number;
  /** bumps whenever the set changes, so lists can refetch */
  version: number;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const enabled = user?.userType === "user";
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setIds(new Set());
      return;
    }
    getFavoriteIds()
      .then((list) => setIds(new Set(list)))
      .catch(() => setIds(new Set()));
  }, [enabled, user?.id]);

  const toggle = useCallback(
    async (salonId: number | string) => {
      const id = Number(salonId);
      const wasFavorite = ids.has(id);
      // optimistic update, rolled back when the request fails
      setIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        if (wasFavorite) await removeFavorite(id);
        else await addFavorite(id);
        setVersion((v) => v + 1);
      } catch {
        setIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) next.add(id);
          else next.delete(id);
          return next;
        });
      }
    },
    [ids]
  );

  const value = useMemo(
    () => ({ enabled, isFavorite: (id: number | string) => ids.has(Number(id)), toggle, count: ids.size, version }),
    [enabled, ids, toggle, version]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
