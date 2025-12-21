import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Banner from "../Components/Banner/Banner";
import Maps from "./Maps/Maps";
import WhyChoice from "./WhyChoice/WhyChoice";
import CustomerReviews from "./CustomerReviews/CustomerReviews";
import PlatformStatistics from "./PlatformStatistics/PlatformStatistics";
import FAQSection from "./FAQSection/FAQSection";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      offset: 120,
      once: false, // scroll up & down = animation repeat
      mirror: true, // scroll up হলে reverse animation
    });

    const timer = setTimeout(() => {
      setLoading(false);
      AOS.refresh();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 z-50">
        <span className="loading loading-spinner loading-xl text-cyan-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <section data-aos="fade-up" data-aos-delay="100">
        <Banner />
      </section>

      <section data-aos="zoom-in" className="mt-10" data-aos-delay="200">
        <Maps />
      </section>

      <section data-aos="fade-right" className="pt-7" data-aos-delay="300">
        <WhyChoice />
      </section>

      <section data-aos="fade-left" className="pt-7" data-aos-delay="400">
        <CustomerReviews />
      </section>

      <section data-aos="flip-up" className="pt-7" data-aos-delay="500">
        <PlatformStatistics />
      </section>

      <section data-aos="fade-up" className="pt-7" data-aos-delay="600">
        <FAQSection />
      </section>
    </div>
  );
};

export default Home;
