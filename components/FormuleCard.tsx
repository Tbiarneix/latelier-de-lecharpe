"use client";

import React, { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FormuleCardProps = {
  nom: string;
  prix: number;
  description: string | null;
  elements: string[];
  emoji?: string;
};

export default function FormuleCard({ nom, prix, description, elements, emoji = "🍽️" }: FormuleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="w-full">
      {/* Titre de la formule = bouton qui déplie le détail */}
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-t-2xl bg-mustard px-8 py-2 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl">
              {emoji}
            </span>
            <span className="text-xl font-specialElite text-blueDark">
              {nom} — {prix}€
            </span>
          </span>
          {isOpen ? (
            <ChevronUp aria-hidden="true" className="ml-5 h-6 w-6 shrink-0 text-blueDark" />
          ) : (
            <ChevronDown aria-hidden="true" className="ml-5 h-6 w-6 shrink-0 text-blueDark" />
          )}
        </button>
      </h3>

      <div id={panelId} hidden={!isOpen} className="w-full rounded-b-xl border-t border-blueDark/30 bg-mustard px-8 py-4">
        {description && <p className="mb-3 font-specialElite text-xl text-blueDark">{description}</p>}
        {elements.length > 0 && (
          <ul className="ml-6 list-disc font-specialElite font-medium text-blueDark">
            {elements.map((el, idx) => (
              <li key={idx} className="py-0.5">
                {el}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
