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

export default function BrunchContent({ files }: { files: MenuFile[] }) {
  return (
      <div className="w-full flex flex-col justify-center items-center bg-cream text-blueLight">
        <div className="w-screen lg:w-3/5 flex flex-col md:flex-row justify-center items-center md:space-x-20 space-y-10 md:pr-10 lg:pr-20">
          <motion.div
            initial="hiddenRight"
            whileInView="visibleRight"
            viewport={{ once: true, margin: "0%" }}
            variants={imagesVariants}
            className="lg:w-1/3 md:w-1/3 w-3/4"
          >
            <img
              src="/img/deco/scenette-brunch-001.jpg"
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
              Bienvenue à L'Atelier de l'Écharpe pour un moment gourmand et détendu !
              <br />
              Chaque dimanche, notre brunch vous invite à redécouvrir les plaisirs simples du petit-déjeuner et du déjeuner — dans un cadre convivial et chaleureux. Au menu : viennoiseries croustillantes, tartines rustiques, œufs façon brunch, salades fraîches, douceurs sucrées, fruits de saison, boissons chaudes ou jus de fruits frais — le tout préparé avec soin à partir de produits locaux et de qualité.
              <br />
              Que vous veniez seul, en couple ou entre amis, le brunch est l’occasion parfaite pour prendre le temps, discuter, rire, et commencer la journée en douceur. L’ambiance cosy et détendue de L’Atelier vous invite à vous poser, flâner, et savourer.
              <br />
              👉 Pensez à réserver pour être sûr d’avoir une table 🍽️
            </article>
          </motion.div>
        </div>

        <div className="lg:w-3/5 w-11/12 flex flex-col items-center justify-center py-20 space-y-6">
          <MenuFiles files={files} label="brunch" />
        </div>
      </div>
  );
}
