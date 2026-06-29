"use client";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { PositionEditor } from "./position-editor";
import type { Position } from "./types";

type PositionDraft = Omit<Position, "id">;

interface AddBondDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initial: PositionDraft;
  onSubmit: (data: PositionDraft) => void;
}

/** Slide-over containing the {@link PositionEditor} for add or edit. */
export function AddBondDialog({ open, onOpenChange, title, initial, onSubmit }: AddBondDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-5 sm:max-w-lg">
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription className="mb-3">All analytics are derived from the financial engine.</SheetDescription>
        <div className="h-[calc(100%-3.5rem)]">
          <PositionEditor
            initial={initial}
            onCancel={() => onOpenChange(false)}
            onSubmit={(data) => {
              onSubmit(data);
              onOpenChange(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
