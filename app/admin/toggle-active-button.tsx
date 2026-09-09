"use client";

import { useTransition } from "react";
import { Ban, RotateCcw } from "lucide-react";
import { toggleActiveAction } from "./actions";
import { btnGhost } from "@/lib/ui";

export function ToggleActiveButton({ userId, active }: { userId: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <form action={toggleActiveAction.bind(null, userId)}>
      <button
        type="submit"
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          const message = active
            ? "¿Desactivar esta cuenta? Su Prolify dejará de verse."
            : "¿Reactivar esta cuenta?";
          if (window.confirm(message)) {
            startTransition(() => toggleActiveAction(userId, new FormData()));
          }
        }}
        className={btnGhost}
      >
        {active ? <Ban className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
        {pending ? "..." : active ? "Desactivar" : "Reactivar"}
      </button>
    </form>
  );
}
