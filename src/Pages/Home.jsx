import React, { useState, useEffect } from "react";
import Banner from "../Components/Banner/Banner";
import Maps from "./Maps/Maps";
import WhyChoice from "./WhyChoice/WhyChoice";
import CustomerReviews from "./CustomerReviews/CustomerReviews";
import PlatformStatistics from "./PlatformStatistics/PlatformStatistics";
import FAQSection from "./FAQSection/FAQSection";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay (or real fetch)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds delay

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
    <div className="min-h-screen">
      <Banner />
      <Maps></Maps>
      <div className="pt-7">
        <WhyChoice></WhyChoice>
      </div>
      <div className="pt-7">
        <CustomerReviews></CustomerReviews>
      </div>
      <div className="pt-7">
        <PlatformStatistics></PlatformStatistics>
      </div>
      <div>
        <FAQSection></FAQSection>
      </div>
    </div>
  );
};

export default Home;
