"use client";

import { useActionState } from "react";
import { Rocket, AlertCircle } from "lucide-react";
import { publishAction } from "./actions";
import { btnPrimary } from "@/lib/ui";

export function PublishButton({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(publishAction.bind(null, slug), undefined);

  return (
    <form action={action} className="flex flex-col items-end gap-2">
      <button type="submit" disabled={pending} className={btnPrimary}>
        <Rocket className="h-4 w-4" />
        {pending ? "Publicando..." : "Publicar cambios"}
      </button>
      {state?.error ? (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
