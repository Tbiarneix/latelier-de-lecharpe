"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const STORAGE_KEY = "happy-hour-popup-closed";

const PRICES = [
  { label: "Pinte de blonde MUNICH", price: "4€" },
  { label: "Pinte des autres bières", price: "5€" },
  { label: "Ricard", price: "2€" },
  { label: "Spritz ou Mojito", price: "5€" },
];

export default function PopUpHappyHour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Une fois fermée, la fenêtre ne revient pas pendant la visite.
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}
    const timer = setTimeout(() => setOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[60] w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-redWine p-6 shadow-xl animate-fadeIn md:w-1/2 lg:w-1/3 focus:outline-none"
        >
          <Dialog.Close
            aria-label="Fermer la fenêtre"
            className="float-right rounded p-1 text-cream hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            <X aria-hidden="true" />
          </Dialog.Close>
          <Dialog.Title className="mb-2 font-specialElite text-xl text-cream">
            Happy hour à l&apos;Atelier de l&apos;Écharpe !
          </Dialog.Title>

          <div className="flex w-full flex-col items-center justify-center">
            <p className="my-2 text-center font-specialElite text-cream">
              Du mardi au samedi
              <br />
              De 17h à 19h
            </p>
            <ul className="mt-4 w-full font-specialElite text-cream sm:w-2/3">
              {PRICES.map((p) => (
                <li key={p.label} className="flex justify-between">
                  <span>{p.label}</span>
                  <span>{p.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
