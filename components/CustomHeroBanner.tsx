"use client";
import { Variants, motion } from "framer-motion";
import React from "react";

const textVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1,
    },
  },
};

function CustomHeroBanner(props: any) {
  return (
    <div
      className="h-96 relative"
      style={{
        backgroundColor: props.colorBG || "#000", // couleur par défaut si rien n'est fourni
      }}
    >
            <div className="relative z-40 h-full flex flex-col items-center justify-center leading-none">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
          className="text-mustard font-specialElite tracking-wide z-40 text-5xl"
          style={{
            color: props.colorText || "#000", // couleur par défaut si rien n'est fourni
          }}
        >
          {props.title}
        </motion.h1>
      </div>
    </div>
  );
}

export default CustomHeroBanner;
