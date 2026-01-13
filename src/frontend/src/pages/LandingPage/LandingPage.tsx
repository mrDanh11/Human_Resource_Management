// src/pages/landing/LandingPage.tsx
import Header from "../../components/common/Header";
import Hero from "../../components/landingPage/Hero";
import Stats from "../../components/landingPage/Stats";
import Activities from "../../components/landingPage/Activities";
import Gallery from "../../components/landingPage/Gallery";
import Footer from "../../components/common/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Activities />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
