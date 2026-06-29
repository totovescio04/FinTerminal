"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { SEGMENT_LABELS } from "@/constants/navigation";
import type { BreadcrumbItem } from "@/types/navigation";

function labelFor(segment: string): string {
  return (
    SEGMENT_LABELS[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Derive breadcrumb items from the current pathname. */
export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      return { label: labelFor(segment), href: isLast ? undefined : href };
    });
  }, [pathname]);
}
