import PopUpHappyHour from "@/components/popups/PopUpHappyHour";
import Footer from "../../components/Footer";
import HeroBanner from "../../components/HeroBanner";
import MainPage from "../../components/MainPage";
import Navbar from "../../components/Navbar";
import { Analytics } from "@vercel/analytics/react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <HeroBanner />
      <PopUpHappyHour />
      <MainPage />
      <Footer />
      <Analytics />
    </main>
  );
}
