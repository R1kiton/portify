"use client";

import { useActionState } from "react";
import { publishAction } from "./actions";
import { btnPrimary } from "@/lib/ui";

export function PublishButton({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(publishAction.bind(null, slug), undefined);

  return (
    <form action={action} className="flex flex-col items-start gap-2">
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Publicando..." : "Publicar cambios"}
      </button>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
    </form>
  );
}
