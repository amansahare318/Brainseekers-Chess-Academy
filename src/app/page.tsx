import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import WhyChoose from "@/components/sections/WhyChoose";
import LearningJourney from "@/components/sections/LearningJourney";
import Courses from "@/components/sections/Courses";
import Coaches from "@/components/sections/Coaches";
import Testimonials from "@/components/sections/Testimonials";
import FreeTrialCTA from "@/components/sections/FreeTrialCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <WhyChoose />
        <LearningJourney />
        <Courses />
        <Coaches />
        <Testimonials />
        <FreeTrialCTA />
      </main>
      <Footer />
    </>
  );
}
