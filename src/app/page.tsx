import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import { IndustryBar } from "@/components/sections/IndustryBar";
import Services from "@/components/sections/Services";
import ChapAI from "@/components/sections/ChapAI";
import { BenchmarkMetrics } from "@/components/sections/BenchmarkMetrics";
import { InsightCarousel } from "@/components/sections/InsightCarousel";
import { CredibilityStrip } from "@/components/sections/CredibilityStrip";
import DemoRequestForm from "@/components/forms/DemoRequestForm";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <CredibilityStrip />
        <IndustryBar />
        <Services />
        <ChapAI />
        <BenchmarkMetrics />
        <InsightCarousel />
        <DemoRequestForm />
      </main>
      <Footer />
    </div>
  );
}
