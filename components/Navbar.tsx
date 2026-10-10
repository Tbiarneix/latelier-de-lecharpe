"use client";

import { Variants, motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const links = [
  { label: "accueil", href: "/" },
  { label: "dîner", href: "/diner" },
  // { label: "brunch", href: "/brunch" },
  { label: "fiesta", href: "/fiesta" },
  { label: "contact", href: "/contact" },
];

const textVariantsTop: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "tween", ease: "linear", duration: 1, delay: 0.5 },
  },
};

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

function Navbar() {
  const pathname = usePathname();
  const current = (href: string) => (pathname === href ? ("page" as const) : undefined);

  return (
    <header className="w-full">
      <motion.nav
        aria-label="Navigation principale"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "30%" }}
        variants={textVariantsTop}
        className="fixed w-full h-16 backdrop-blur justify-between items-center text-white px-8 z-50 bg-blueLight hidden lg:flex"
      >
        <Link href="/" className={`w-40 ${focus}`} aria-label="L'Atelier de l'Écharpe, accueil">
          {/* Logo rouge passé en blanc : le rouge sur le bandeau bleu ne contraste pas assez (1,6:1). */}
          <img src="/img/logo/logo-red.png" alt="" className="brightness-0 invert" />
        </Link>
        <ul className="flex justify-center space-x-12">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current(link.href)}
                className={`border-b border-transparent font-specialElite leading-none hover:border-white aria-[current=page]:border-white text-2xl tracking-wide ${focus}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/reservation"
          aria-current={current("/reservation")}
          className={`px-5 py-2 bg-white/5 hover:bg-redWine leading-none duration-200 text-white text-2xl tracking-wide font-specialElite ${focus}`}
        >
          réservation
        </Link>
      </motion.nav>

      <div className="lg:hidden fixed top-6 z-50 flex justify-between w-full px-6">
        <Sheet>
          <SheetTrigger
            aria-label="Ouvrir le menu"
            className="overflow-hidden rounded-full shadow flex justify-center items-center h-10 w-10 bg-white text-blueDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueLight"
          >
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent aria-describedby={undefined} className="bg-[#002E6D]">
            <img
              src="/img/deco/img-rino-pink-1.jpg"
              alt=""
              className="-z-10 opacity-80 h-screen w-screen absolute transform scale-x-[-1]"
            />
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Menu principal">
                <ul className="flex flex-col p-6">
                  {[...links, { label: "réservation", href: "/reservation" }].map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          aria-current={current(item.href)}
                          className="overflow-hidden h-20 w-4/5 flex items-center text-white hover:bg-[#274b7e] aria-[current=page]:bg-[#274b7e] duration-300 px-5 py-3 text-2xl tracking-wide font-specialElite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Link
          href="/reservation"
          className="shadow overflow-hidden h-10 px-3 rounded-full bg-mustard flex items-center justify-center text-xl tracking-wide text-blueLight font-specialElite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blueLight"
        >
          réserver
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
