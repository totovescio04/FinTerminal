import { CandlestickChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/constants/app";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
        <CandlestickChart className="h-[18px] w-[18px]" />
      </span>
      {showWordmark && (
        <span className="text-sm font-semibold tracking-tight">
          Fin<span className="text-muted-foreground">Terminal</span>
          <span className="sr-only">{APP_NAME}</span>
        </span>
      )}
    </div>
  );
}
