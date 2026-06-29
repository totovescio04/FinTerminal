"use client";

import { Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FieldLabelProps {
  htmlFor: string;
  label: string;
  tooltip?: string;
}

/** Shared label row with an optional info tooltip. */
export function FieldLabel({ htmlFor, label, tooltip }: FieldLabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="text-muted-foreground/70 hover:text-foreground" aria-label={`${label} info`}>
              <Info className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[220px] text-center">{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
