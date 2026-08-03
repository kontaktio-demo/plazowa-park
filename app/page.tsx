import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EstateOrbit from "@/components/EstateOrbit";
import EstateExplorer from "@/components/estate/EstateExplorer";
import InteriorTour from "@/components/InteriorTour";
import Standard from "@/components/Standard";
import ScrollProgress from "@/components/ScrollProgress";
import Okolica from "@/components/Okolica";
import Developer from "@/components/Developer";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <EstateOrbit />
        <EstateExplorer />
        <InteriorTour />
        <Standard />
        <Okolica />
        <Developer />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
