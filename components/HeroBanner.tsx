"use client";

import { Variants, motion } from "framer-motion";
import React from "react";

const textVariantsLeft: Variants = {
  hidden: {
    x: -200,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

const textVariantsTop: Variants = {
  hidden: {
    y: -300,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 2,
    },
  },
};

const textVariantsRight: Variants = {
  hidden: {
    x: 200,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 3,
    },
  },
};

function HeroBanner() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-cream">
      <div className="flex w-screen absolute">
        <img
          src="/img/deco/img-rino-red-1-rbg.png"
          alt=""
          className="object-cover opacity-70"
        />
      </div>
      <div className="relative z-20 flex flex-col leading-none">
        {/* Un seul titre : « L'ATELIER DE L'ÉCHARPE », composé de trois éléments animés. */}
        <h1 className="flex flex-col leading-none">
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariantsLeft}
            className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-blueLight tracking-wider font-eina"
          >
            L&apos;ATELIER
          </motion.span>{" "}
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariantsTop}
            className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-blueLight tracking-wide"
          >
            <span className="absolute -rotate-90 translate-x-[138px] -translate-y-[42px] sm:translate-x-[172px] sm:-translate-y-[52px] md:translate-x-[206px] md:-translate-y-[63px] lg:translate-x-[275px] lg:-translate-y-[84px] font-eina">
              DE
            </span>
          </motion.span>{" "}
          <motion.span
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariantsRight}
            className="block text-blueLight text-xl sm:text-2xl md:text-3xl lg:text-4xl text-end font-eina"
          >
            L&apos;ÉCHARPE
          </motion.span>
        </h1>
      </div>
    </div>
  );
}

export default HeroBanner;
