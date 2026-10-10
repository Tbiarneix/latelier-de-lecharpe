"use client"

import { Banknote, CreditCard, Coins } from "lucide-react";
import React from "react";

export default function ContactContent({ hoursList }: { hoursList: React.ReactNode }) {
  return (
      <div className="w-full flex flex-col lg:flex-row justify-between lg:space-x-8 space-y-12 lg:space-y-0">
        <div className="lg:w-1/2 lg:pl-8 flex flex-col items-center justify-center lg:py-8">

          <img
            src="/img/logo/logo-red.png"
            alt="L'Atelier de l'Écharpe"
            className="w-1/2"
          />

          <div className="flex flex-col md:flex-row justify-between space-y-12 md:space-x-10">
            <div className="flex flex-col justify-between items-center space-y-8">
              <div className="text-blueLight font-specialElite flex flex-col space-y-3 items-center lg:items-start justify-center">
                <p className="underline">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=L%27Atelier+de+l%27%C3%A9charpe+8+rue+de+l%27%C3%89charpe+Toulouse">
                    8 rue de l'Écharpe, 31000 Toulouse
                  </a>
                </p>
                <a href="tel:+33534309335">TEL : +33 5 34 30 93 35</a>
                {/* <a href="tel:">Mobile : +33</a> */}
              </div>

              <div className="text-[#002E6D] w-full flex flex-col space-y-3 items-center lg:items-start justify-center">
                <h2>Modes de paiement</h2>
                <ul className="flex items-center space-x-10">
                  <li className="scale-125" title="Carte de crédit">
                    <CreditCard aria-hidden="true" />
                    <span className="sr-only">Carte de crédit</span>
                  </li>
                  <li className="scale-125" title="Chèques vacances">
                    <Banknote aria-hidden="true" />
                    <span className="sr-only">Chèques vacances</span>
                  </li>
                  <li className="scale-125" title="Espèces">
                    <Coins aria-hidden="true" />
                    <span className="sr-only">Espèces</span>
                  </li>
                </ul>
              </div>

              <div className="text-[#002E6D] flex w-full flex-col justify-center items-center lg:items-start">
                <ul aria-label="Services" className="flex w-full flex-col items-center lg:items-start space-y-3">
                  <li>Animaux acceptés</li>
                  <li>Accès Internet Wifi</li>
                  <li>
                    <span aria-hidden="true">🇬🇧 </span>Anglais<span className="sr-only"> parlé</span>
                  </li>
                  <li>
                    <span aria-hidden="true">🇪🇸 </span>Espagnol<span className="sr-only"> parlé</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:w-3/4 text-redWine flex flex-col">
              <h2 className="font-specialElite text-4xl mb-3 text-center">HORAIRES</h2>

              {hoursList}
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center lg:h-[750px] h-[500px] overflow-hidden">
          <iframe
            title="Plan d'accès : L'Atelier de l'Écharpe, 8 rue de l'Écharpe, Toulouse"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d859.6416101680815!2d1.440994128565754!3d43.600321598186525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aebb62d0929fbf%3A0x558cf6d51666b0f1!2sL'Atelier%20de%20l'%C3%A9charpe!5e1!3m2!1sfr!2sfr!4v1791643177180!5m2!1sfr!2sfr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="rounded-3xl"
          />
        </div>
      </div>
  );
}
