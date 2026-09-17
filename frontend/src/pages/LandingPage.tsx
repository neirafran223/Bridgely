import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import Projects from "../components/landing/Projects";
import Testimonials from "../components/landing/Testimonials";
import TrustSection from "../components/landing/TrustSection";
import Cta from "../components/landing/Cta";
import Faq from "../components/landing/Faq";
import Footer from "../components/landing/Footer";
import BackgroundDecor from "../components/BackgroundDecor";
import Reveal from "../components/Reveal";

function SectionDivider() {
  return <div className="section-divider max-w-4xl mx-auto" />;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent relative">
      <BackgroundDecor />
      <Navbar />
      <Hero />
      <Stats />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <Reveal>
        <Features />
      </Reveal>
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <Reveal delay={80}>
        <TrustSection />
      </Reveal>
      <SectionDivider />
      <Reveal delay={80}>
        <Faq />
      </Reveal>
      <Cta />
      <Footer />
    </div>
  );
}
