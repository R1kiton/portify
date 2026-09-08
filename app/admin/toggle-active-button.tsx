"use client";

import { useTransition } from "react";
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
            ? "¿Desactivar esta cuenta? Su EProfile dejará de verse."
            : "¿Reactivar esta cuenta?";
          if (window.confirm(message)) {
            startTransition(() => toggleActiveAction(userId, new FormData()));
          }
        }}
        className={btnGhost}
      >
        {pending ? "..." : active ? "Desactivar" : "Reactivar"}
      </button>
    </form>
  );
}
