import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import EstateOrbit from "@/components/EstateOrbit";
import EstateExplorer from "@/components/estate/EstateExplorer";
import VirtualTour from "@/components/VirtualTour";
import Standard from "@/components/Standard";
import Lifestyle from "@/components/Lifestyle";
import Marquee from "@/components/Marquee";
import ScrollProgress from "@/components/ScrollProgress";
import SideRails from "@/components/SideRails";
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
      <SideRails />
      <Nav />
      <main>
        <Hero />
        <EstateOrbit />
        <EstateExplorer />
        <Marquee
          items={["82-133 m² powierzchni", "prywatny ogród", "taras z panoramicznymi oknami", "2 miejsca postojowe", "poddasze w cenie"]}
          duration={30}
        />
        <VirtualTour />
        <Standard />
        <Lifestyle />
        <Marquee
          dark
          reverse
          items={["Zalew Mrożyczka", "Central Wake Park", "plaża i przystań", "ścieżki rowerowe", "ponad 100-letni las"]}
          duration={36}
        />
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
