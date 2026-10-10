import { Mail, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import Link from "next/link";
import HoursList from "@/components/HoursList";
import { getOpeningHours } from "@/lib/data";

async function Footer() {
  const hours = await getOpeningHours();

  return (
    <footer aria-label="Informations pratiques" className="w-full bg-redWine flex flex-col justify-center items-center">
      <div className="flex flex-col lg:flex-row w-5/6 lg:justify-between justify-center items-center p-4 space-y-12 lg:space-y-0">
        <div className="lg:w-1/3 w-full text-cream flex flex-col items-center justify-center">
          <h2 className="font-specialElite text-4xl mb-3">HORAIRES</h2>

          <HoursList hours={hours} className="flex flex-col items-center justify-center space-y-2 text-center" />
        </div>

        <div className="lg:w-1/3 w-full text-cream flex flex-col items-center justify-center">
          <h2 className="font-specialElite text-4xl mb-3">ADRESSE</h2>
          <a
            className="flex flex-col items-center justify-center text-center hover:underline"
            href="https://www.google.com/maps/search/?api=1&query=L%27Atelier+de+l%27%C3%A9charpe+8+rue+de+l%27%C3%89charpe+Toulouse"
          >
            8 rue de l'Écharpe
            <br />
            31000, Toulouse
          </a>
        </div>

        <div className="lg:w-1/3 w-full text-cream flex flex-col items-center justify-center">
          <h2 className="font-specialElite text-4xl mb-3">CONTACT</h2>
          <ul className="flex flex-col items-center justify-center">
            <li className="flex gap-2 mb-3 hover:underline">
              <Mail />
              <a href="mailto:atelier1524@orange.fr">
                atelier1524@orange.fr
              </a>
            </li>
            <li className="flex gap-2 mb-3 hover:underline">
              <Phone />
              <a href="tel:+33534309335">+33 5 34 30 93 35</a>
            </li>
            <li className="flex gap-2 mb-3 hover:underline">
              <InstagramIcon />
              <a href="https://www.instagram.com/latelierdelecharpe_/">@latelierdelecharpe_</a>
            </li>
          </ul>
        </div>

        <div className="w-60 flex items-center justify-center">
          <img src="/img/logo/logo-cream.png" alt="L'Atelier de l'Écharpe" />
        </div>
      </div>

      <div className="w-full bg-cream py-3 text-sm text-redWine flex flex-wrap justify-center items-center gap-x-6 gap-y-2 px-4">
        <Link href="/mentions-legales" className="underline hover:no-underline">
          Mentions légales
        </Link>
        <Link href="/confidentialite" className="underline hover:no-underline">
          Politique de confidentialité
        </Link>
        <a href="https://thomasbiarneix.com" className="underline hover:no-underline">
          © Site créé par Thomas Biarneix - 2026
        </a>
      </div>
    </footer>
  );
}

export default Footer;
