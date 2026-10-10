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

export default function FiestaContent({ files }: { files: MenuFile[] }) {
  return (
      <div className="w-full flex flex-col justify-center items-center bg-pinkLight text-cream">
        <div className="w-screen lg:w-3/5 flex flex-col md:flex-row justify-center items-center md:space-x-20 space-y-10 md:pr-10 lg:pr-20">
          <motion.div
            initial="hiddenRight"
            whileInView="visibleRight"
            viewport={{ once: true, margin: "0%" }}
            variants={imagesVariants}
            className="lg:w-1/3 md:w-1/3 w-3/4"
          >
            <img
              src="/img/deco/scenette-fiesta-001.jpg"
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
              Quand vient la nuit, L'Atelier de l'Écharpe revêt ses habits de fête — tapas, cocktails, bonne musique et ambiance décontractée au rendez-vous.
              <br />
              Le bar s’anime : planches à partager, tapas variés, burgers ou petites assiettes, le tout à consommer autour d’un verre, d’un cocktail, ou d’un ballon de vin. L’endroit se prête parfaitement aux soirées entre amis, aux afterworks, ou aux moments festifs improvisés.
              <br />
              La soirée monte d’un cran après 22h : musique, rires, ambiance cosy et détendue, ce lieu devient un véritable point de rendez-vous pour ceux qui veulent prolonger la nuit sans quitter l’esprit bistrot/bar. 🎶
              <br />
              👉 Réserve ta soirée, viens comme tu es, et rejoins-nous pour un moment festif, chaleureux et inoubliable.
            </article>
          </motion.div>
        </div>

        <div className="lg:w-3/5 w-11/12 flex flex-col items-center justify-center py-20 space-y-6">
          <MenuFiles files={files} label="fiesta" />
        </div>
      </div>
  );
}
