"use client"

import React from "react";
import MenuFiles from "@/components/menu/MenuFiles";
import type { MenuFile } from "@/lib/data";
import { Variants, motion } from "framer-motion";

const imagesVariants: Variants = {
  hiddenBottom: {
    y: 100,
    opacity: 0,
  },
  visibleBottom: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
    },
  },
  hiddenLeft: {
    x: 200,
    opacity: 0,
  },
  visibleLeft: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
    },
  },
  hiddenRight: {
    x: -200,
    opacity: 0,
  },
  visibleRight: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
    },
  },
};

export default function DinerContent({ files }: { files: MenuFile[] }) {
  return (
      <div className="w-full flex flex-col justify-center items-center bg-redWine text-cream">
        <div className="w-screen lg:w-3/5 flex flex-col md:flex-row justify-center items-center md:space-x-20 space-y-10 md:pr-10 lg:pr-20">
          <motion.div
            initial="hiddenRight"
            whileInView="visibleRight"
            viewport={{ once: true, margin: "0%" }}
            variants={imagesVariants}
            className="lg:w-1/3 md:w-1/3 w-3/4"
          >
            <img
              src="/img/deco/scenette-diner-001.jpg"
              alt=""
              className=""
            />
          </motion.div>
        
          <motion.div
            initial="hiddenLeft"
            whileInView="visibleLeft"
            viewport={{ once: true, margin: "0%" }}
            variants={imagesVariants}
            className="lg:w-2/3 md:w-1/3 w-3/4"
          >
            <article className="text-justify font-specialElite">
              Quand le soir tombe, L'Atelier de l'Écharpe se transforme en bistrot-brasserie chaleureux. Nous proposons une cuisine du marché, élaborée à partir de produits frais et si possible locaux : charcuteries artisanales, fromages affinés, légumes de saison, pains spéciaux — tout est pensé pour ravir vos papilles.
              <br />
              À partager ou en plat principal : tapas, planches de charcuterie/fromage, gambas à la plancha, plats mijotés, burgers… De quoi satisfaire les petites et grandes faims. Pour accompagner, une belle sélection de vins, verres de vin au ballon, cocktails maison ou bières — l’accord parfait entre cuisine simple et goût raffiné.
              <br />
              L’ambiance est conviviale, le décor contemporain et stylé donne le ton : L’Atelier de l’Écharpe est l’endroit idéal pour un dîner entre amis, un repas informel ou une sortie en couple. On prend le temps, on partage, on savoure.
              <br />
              🍷 À déguster sans modération, dans la bonne humeur.
            </article>
          </motion.div>
        </div>

        <div className="lg:w-3/5 w-11/12 flex flex-col items-center justify-center py-20 space-y-6">
          <MenuFiles files={files} label="dîner" />
        </div>
      </div>
  );
}
