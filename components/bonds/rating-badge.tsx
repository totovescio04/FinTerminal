"use client";

import { Badge } from "@/components/ui/badge";
import { ratingClass } from "@/lib/data/bond-model";

interface RatingBadgeProps {
  rating: string;
}

/** Rating chip coloured by investment-grade / high-yield class. */
export function RatingBadge({ rating }: RatingBadgeProps) {
  const cls = ratingClass(rating);
  const variant = cls === "IG" ? "positive" : cls === "HY" ? "negative" : "muted";
  return <Badge variant={variant}>{rating}</Badge>;
}
