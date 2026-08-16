import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EstateOrbit from "@/components/EstateOrbit";
import EstateExplorer from "@/components/estate/EstateExplorer";
import VirtualTour from "@/components/VirtualTour";
import Standard from "@/components/Standard";
import Zycie from "@/components/Zycie";
import Marquee from "@/components/Marquee";
import ScrollProgress from "@/components/ScrollProgress";
import DepthRail from "@/components/DepthRail";
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
      <DepthRail />
      <Nav />
      <main>
        <Hero />
        <EstateOrbit />
        <EstateExplorer />
        <VirtualTour />
        <Standard />
        <div className="band band-deep">
          <Marquee items={["Zalew Mrożyczka", "Central Wake Park", "plaża i przystań", "ścieżki rowerowe", "ponad 100-letni las"]} />
        </div>
        <Zycie />
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
