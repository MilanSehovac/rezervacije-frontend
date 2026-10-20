import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

/** Heart toggle for customers. Renders nothing for guests and salon owners. */
export function FavoriteButton({ salonId, className = "" }: { salonId: number | string; className?: string }) {
  const { enabled, isFavorite, toggle } = useFavorites();
  if (!enabled) return null;
  const active = isFavorite(salonId);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Save to favorites"}
      onClick={(e) => {
        // the card around it is a link
        e.preventDefault();
        e.stopPropagation();
        toggle(salonId);
      }}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-105 ${className}`}
    >
      <Heart className={`h-5 w-5 ${active ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
    </button>
  );
}
