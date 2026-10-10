"use client";

import { Variants, motion } from "framer-motion";
import Link from "next/link";
import React from "react";

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
    x: 20,
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
    x: -20,
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

function IntroRestaurant() {
  return (
    <div className="flex justify-center items-center py-14">
      <div className="w-screen lg:w-3/5 flex flex-col lg:flex-row justify-center items-center lg:space-x-20 space-y-10">
        <motion.div
          initial="hiddenRight"
          whileInView="visibleRight"
          viewport={{ once: true, margin: "-20%" }}
          variants={imagesVariants}
          className="lg:w-1/2 w-3/4"
        >
          <img
            src="/img/deco/rino-full-blue.png"
            alt=""
            className=""
          />
        </motion.div>

        <motion.div
          initial="hiddenLeft"
          whileInView="visibleLeft"
          viewport={{ once: true, margin: "-20%" }}
          variants={imagesVariants}
          className="lg:w-1/2 w-5/6 flex flex-col justify-center items-center space-y-8"
        >
          <h2 className="text-blueDark font-specialElite text-2xl text-center">
            Un lieu, trois ambiances...
          </h2>
          <p className="text-blueDark font-specialElite text-2xl">
            brunch | dîner | night
          </p>
          <p className="text-blueDark text-justify font-specialElite">
            Ben &amp; Gilles sont ravis de vous accueillir à l&apos;Atelier de l&apos;Echarpe, nouveau lieu de fiesta à Toulouse, 8 rue de l&apos;écharpe 31000 Toulouse, tout près de la place Esquirol, de l&apos;hotel d&apos;Assezat et du Pont-Neuf.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default IntroRestaurant;
