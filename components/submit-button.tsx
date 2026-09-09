"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { btnPrimary, btnDanger } from "@/lib/ui";

export function SubmitButton({
  children,
  pendingText,
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();
  const className = variant === "danger" ? btnDanger : btnPrimary;

  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingText ?? "Guardando..."}
        </>
      ) : (
        children
      )}
    </button>
  );
}
