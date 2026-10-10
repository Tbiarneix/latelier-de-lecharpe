"use client";

import { useState, useTransition } from "react";
import { decide, type DecisionResult } from "./actions";
import { describeDecision } from "@/lib/reservations/status";

const base =
  "min-h-12 rounded-lg px-6 py-3 text-lg font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2 disabled:opacity-60";

export default function DecisionForm({ token, hasEmail }: { token: string; hasEmail: boolean }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<DecisionResult | null>(null);

  function choose(decision: "confirmed" | "refused") {
    startTransition(async () => setResult(await decide(token, decision)));
  }

  const finished = result !== null && result.kind !== "error";

  return (
    <div>
      {!finished && (
        <div className="flex flex-wrap gap-4">
          <button type="button" disabled={pending} onClick={() => choose("confirmed")} className={`${base} bg-green-800 hover:bg-green-900`}>
            Valider la réservation
          </button>
          <button type="button" disabled={pending} onClick={() => choose("refused")} className={`${base} bg-redWine hover:bg-red-900`}>
            Refuser la réservation
          </button>
        </div>
      )}
      {!finished && !hasEmail && (
        <p className="mt-3 text-sm">Ce client n&apos;a pas laissé d&apos;email : il ne sera pas prévenu par mail.</p>
      )}

      <div role="status" className={result ? "mt-4 rounded-lg border-2 border-blueDark bg-white p-4 font-semibold" : "sr-only"}>
        {result && result.kind !== "error" && describeDecision(result)}
      </div>
      <div role="alert" className={result?.kind === "error" ? "mt-4 font-semibold text-redWine" : "sr-only"}>
        {result?.kind === "error" ? "Une erreur est survenue. Rechargez la page et réessayez." : ""}
      </div>
    </div>
  );
}
