import { Star } from "lucide-react";

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} width={size} height={size} className={n <= Math.round(value) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"} />
      ))}
    </span>
  );
}
