import Navbar from "@/components/layout/Navbar";
import BottomAccessBar from "@/components/layout/BottomAccessBar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import ChapAI from "@/components/sections/ChapAI";
import VideoPreview from "@/components/sections/VideoPreview";
import WhyPSE from "@/components/sections/WhyPSE";
import DemoRequestForm from "@/components/forms/DemoRequestForm";

export default function Home() {
  return (
    <div className="pb-[72px]">
      <Navbar />
      <BottomAccessBar />
      <main>
        <Hero />
        <Services />
        <ChapAI />
        <VideoPreview />
        <WhyPSE />
        <DemoRequestForm />
      </main>
      <Footer />
    </div>
  );
}
