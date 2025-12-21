import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqData = [
  {
    id: 1,
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 2–4 working days depending on your location.",
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept bKash, Nagad, Rocket, debit/credit cards, and Cash on Delivery.",
  },
  {
    id: 3,
    question: "Can I return or exchange a book?",
    answer:
      "Yes, you can return or exchange books within 7 days if they are damaged or incorrect.",
  },
  {
    id: 4,
    question: "Do you deliver all over Bangladesh?",
    answer: "Yes, we deliver to all major districts across Bangladesh.",
  },
  {
    id: 5,
    question: "How can I track my order?",
    answer:
      "After placing an order, you will receive a tracking ID via SMS or email.",
  },
];

const FAQSection = () => {
  const [activeId, setActiveId] = useState(null);

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-100 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-7 sm:mb-12 text-gray-800">
          Frequently Asked <span className="text-blue-600">Questions</span>
        </h2>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className=" cursor-pointer w-full flex justify-between items-center p-5 text-left"
              >
                <span className="font-semibold text-gray-800">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-gray-500 transition-transform ${
                    activeId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeId === faq.id && (
                <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
