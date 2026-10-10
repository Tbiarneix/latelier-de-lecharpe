"use client";

import { Variants, motion } from "framer-motion";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { Menu } from "lucide-react";

const links = [
  {
    label: "accueil",
    href: "/",
  },
  {
    label: "dîner",
    href: "/diner",
  },
  // {
  //   label: "brunch",
  //   href: "/brunch",
  // },
  {
    label: "fiesta",
    href: "/fiesta",
  },
  {
    label: "contact",
    href: "/contact",
  },
];

const textVariantsTop: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "tween",
      ease: "linear",
      duration: 1,
      delay: 0.5,
    },
  },
};

function Navbar() {
  return (
    <nav className="w-full">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "30%" }}
        variants={textVariantsTop}
        className="fixed w-full h-16 backdrop-blur justify-between items-center text-white px-8 z-50 bg-blueLight hidden lg:flex"
      >
        <a href="/" className="w-40">
          <img src="/img/logo/logo-red.png" alt="Logo" />
        </a>
        <div>
          <li className="flex justify-center space-x-12">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b-[1px] font-specialElite border-transparent leading-none hover:border-b-[1px] hover:border-white text-2xl tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </li>
        </div>
        <Link
          href="/reservation"
          className="px-3 py-1 bg-white/5 hover:bg-redWine leading-none cursor-pointer duration-200 text-white hover:text-blueLight text-2xl tracking-wide font-specialElite"
        >
          réservation
        </Link>
      </motion.div>

      <div className="lg:hidden fixed top-6 z-50 flex justify-between w-full px-6">
        <Sheet key="left">
          <SheetTrigger aria-label="Ouvrir le menu" className="overflow-hidden rounded-full shadow flex justify-center items-center h-10 w-10">
            {/* <img src="/hamburger-menu.png" alt="hamburger menu icon" /> */}
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent aria-describedby={undefined} className="bg-[#002E6D]">
            <img src="/img/deco/img-rino-pink-1.jpg" alt="Background menu" className="-z-10 opacity-80 h-screen w-screen absolute transform scale-x-[-1]" /> 
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Menu principal" className="flex flex-col p-6">
                {links.map((items) => (
                  <a
                    key={items.label}
                    href={items.href}
                    className="overflow-hidden h-20 w-4/5 flex items-center text-white hover:bg-[#274b7e] duration-300 px-5 py-3 cursor-pointer"
                  >
                    <h3 className="text-2xl tracking-wide font-specialElite">
                      {items.label}
                    </h3>
                  </a>
                ))}
                <a
                  href="/reservation"
                  className="overflow-hidden h-20 w-4/5 flex items-center text-white hover:bg-[#274b7e] duration-300 px-5 py-3 cursor-pointer"
                >
                  <h3 className="text-2xl tracking-wide font-specialElite">
                    réservation
                  </h3>
                </a>
              </nav>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <a
          href="/reservation"
          className="shadow cursor-pointer overflow-hidden h-10 px-3 rounded-full bg-mustard flex items-center justify-center"
        >
          <h3 className="text-xl tracking-wide text-blueLight font-specialElite">réserver</h3>
        </a>
        {/* <a href="/reservation" className="shadow cursor-pointer overflow-hidden w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Utensils />
        </a> */}
      </div>
    </nav>
  );
}

export default Navbar;
