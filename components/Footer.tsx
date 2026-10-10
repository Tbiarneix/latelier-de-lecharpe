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
            href="https://www.google.fr/maps/place/8+Rue+de+l'%C3%89charpe,+31000+Toulouse/@43.6020582,1.4432728,676m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12aebc9daaafffff:0x6b0c27a5efb0ecff!8m2!3d43.6020582!4d1.4458477!16s%2Fg%2F11l_4l0gq7?entry=ttu&g_ep=EgoyMDI1MTExNi4wIKXMDSoASAFQAw%3D%3D"
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
        <a href="https://portfolio-pablo-teal.vercel.app/" className="underline hover:no-underline">
          © This is a PABLO ORTEGA creation - 2025
        </a>
      </div>
    </footer>
  );
}

export default Footer;
