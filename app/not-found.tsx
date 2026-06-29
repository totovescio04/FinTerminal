import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-5xl font-semibold tracking-tight">404</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page doesn&apos;t exist yet. It may be part of a later stage of FinTerminal.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
