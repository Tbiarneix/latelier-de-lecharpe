"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Banknote, CreditCard, Coins, Ticket } from "lucide-react";
import React from "react";

export default function ContactContent({ hoursList }: { hoursList: React.ReactNode }) {
  return (
      <div className="w-full flex flex-col lg:flex-row justify-between lg:space-x-8 space-y-12 lg:space-y-0">
        <div className="lg:w-1/2 lg:pl-8 flex flex-col items-center justify-center lg:py-8">

          <img
            src="/img/logo/logo-red.png"
            alt="Logo"
            className="w-1/2"
          />

          <div className="flex flex-col md:flex-row justify-between space-y-12 md:space-x-10">
            <div className="flex flex-col justify-between items-center space-y-8">
              <div className="text-blueLight font-specialElite flex flex-col space-y-3 items-center lg:items-start justify-center">
                <h4 className="underline">
                  <a href="https://www.google.com/maps/dir//8+Rue+de+l'%C3%89charpe+31000+Toulouse/@43.6020582,1.4458477,17z/data=!4m8!4m7!1m0!1m5!1m1!1s0x12aebc9daaafffff:0x6b0c27a5efb0ecff!2m2!1d1.4458477!2d43.6020582?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D">
                    8 rue de l'Écharpe, 31000 Toulouse
                  </a>
                </h4>
                <a href="tel:+33534309335">TEL : +33 5 34 30 93 35</a>
                {/* <a href="tel:">Mobile : +33</a> */}
              </div>

              <div className="text-[#002E6D] w-full flex flex-col space-y-3 items-center lg:items-start justify-center">
                <p>Modes de paiment</p>
                <div className="flex items-center space-x-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="scale-125">
                          <CreditCard />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Carte de crédit</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="scale-125">
                          <Banknote />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chèques vacances</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="scale-125">
                          <Coins />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Espèces</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="text-[#002E6D] flex w-full flex-col justify-center items-center lg:items-start space-y-3">
                <p>Animaux acceptés</p>
                <p>Accès Internet Wifi</p>
                <p>🇬🇧 Anglais</p>
                <p>🇪🇸 Espagnol</p>
              </div>
            </div>

            <div className="lg:w-3/4 text-redWine flex flex-col">
              <h4 className="font-specialElite text-4xl mb-3 text-center">HORAIRES</h4>

              {hoursList}
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center lg:h-[750px] h-[500px] overflow-hidden">
          <iframe
              title="Google Map"
              width="100%"
              height="100%"
              style={{ 
                border: 10,
                padding: 40,
                borderRadius: 50
               }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2941.883308141408!2d1.4432727762339608!3d43.60205817110451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12aebc9daaafffff%3A0x6b0c27a5efb0ecff!2s8%20Rue%20de%20l&#39;%C3%89charpe%2C%2031000%20Toulouse!5e1!3m2!1sfr!2sfr!4v1763412495463!5m2!1sfr!2sfr"
              className="rounded-3xl"
          >
          </iframe>
        </div>
      </div>
  );
}
