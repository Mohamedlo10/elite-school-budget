import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}