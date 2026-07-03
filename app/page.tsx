import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import EstateOrbit from "@/components/EstateOrbit";
import Lifestyle from "@/components/Lifestyle";
import EstateExplorer from "@/components/estate/EstateExplorer";
import InteriorTour from "@/components/InteriorTour";
import Standard from "@/components/Standard";
import Gallery from "@/components/Gallery";
import Okolica from "@/components/Okolica";
import Finansowanie from "@/components/Finansowanie";
import Developer from "@/components/Developer";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustStrip />
        <EstateOrbit />
        <Lifestyle />
        <EstateExplorer />
        <InteriorTour />
        <Standard />
        <Gallery />
        <Okolica />
        <Finansowanie />
        <Developer />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
