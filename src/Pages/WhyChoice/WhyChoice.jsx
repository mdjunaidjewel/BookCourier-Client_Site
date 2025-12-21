import React from "react";
import { FaShippingFast, FaBook, FaHeadset, FaShieldAlt } from "react-icons/fa";

const WhyChoice = () => {
  const reasons = [
    {
      icon: <FaShippingFast size={40} className="text-blue-500 mx-auto" />,
      title: "Fast Delivery",
      description:
        "Books delivered quickly and reliably to your doorstep with trusted courier services.",
    },
    {
      icon: <FaBook size={40} className="text-green-500 mx-auto" />,
      title: "Wide Collection",
      description:
        "Explore a large selection of books from various genres and popular authors.",
    },
    {
      icon: <FaHeadset size={40} className="text-yellow-500 mx-auto" />,
      title: "24/7 Support",
      description:
        "Support team is always ready to assist you with orders and queries anytime.",
    },
    {
      icon: <FaShieldAlt size={40} className="text-red-500 mx-auto" />,
      title: "Secure Payments",
      description:
        "Safe and secure payment options ensuring 100% transaction protection.",
    },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-4 sm:mb-8">
          Why Choose <span className="text-yellow-600">BookCourier</span> ?
        </h2>
        <p className="text-gray-600 mb-12">
          Discover why BookCourier is the preferred choice for book lovers.
          Reliable delivery, wide selection, and secure payments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center"
            >
              <div className="mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChoice;
