import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import EstateOrbit from "@/components/EstateOrbit";
import Lifestyle from "@/components/Lifestyle";
import StatsBand from "@/components/StatsBand";
import EstateExplorer from "@/components/estate/EstateExplorer";
import InteriorTour from "@/components/InteriorTour";
import Standard from "@/components/Standard";
import BeforeAfter from "@/components/BeforeAfter";
import Gallery from "@/components/Gallery";
import ScrollProgress from "@/components/ScrollProgress";
import Okolica from "@/components/Okolica";
import Finansowanie from "@/components/Finansowanie";
import Harmonogram from "@/components/Harmonogram";
import Developer from "@/components/Developer";
import CinematicBand from "@/components/CinematicBand";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import ExitIntent from "@/components/ExitIntent";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <EstateOrbit />
        <Lifestyle />
        <StatsBand />
        <EstateExplorer />
        <InteriorTour />
        <Standard />
        <BeforeAfter />
        <Gallery />
        <Okolica />
        <Finansowanie />
        <Harmonogram />
        <Developer />
        <CinematicBand />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
      <ExitIntent />
    </>
  );
}
