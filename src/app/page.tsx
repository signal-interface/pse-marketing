import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Services from "@/components/sections/Services";
import ChapAI from "@/components/sections/ChapAI";
import WhyPSE from "@/components/sections/WhyPSE";
import DemoRequestForm from "@/components/forms/DemoRequestForm";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <ChapAI />
        <WhyPSE />
        <DemoRequestForm />
      </main>
      <Footer />
    </div>
  );
}
