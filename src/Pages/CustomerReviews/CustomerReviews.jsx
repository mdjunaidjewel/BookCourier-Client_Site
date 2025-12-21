import React from "react";
import { FaUserCircle, FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Md. Junaid Jewel",
    rating: 5,
    feedback:
      "BookCourier delivered my books super fast! Excellent service and very reliable.",
  },
  {
    id: 2,
    name: "Md. Mahid",
    rating: 4,
    feedback:
      "Wide collection of books and secure payment options. Really happy with the service.",
  },
  {
    id: 3,
    name: "Munnaf Sarkar",
    rating: 5,
    feedback:
      "24/7 customer support helped me with my queries. Highly recommended!",
  },
  {
    id: 4,
    name: "Hasan Ali",
    rating: 4,
    feedback: "Affordable prices and timely delivery. Will order again!",
  },
  {
    id: 5,
    name: "Nishat Ahmmed",
    rating: 5,
    feedback: "Books arrived in perfect condition. Packaging was excellent.",
  },
  {
    id: 6,
    name: "Tahia Tabassum",
    rating: 5,
    feedback: "User-friendly website and fast checkout process. Loved it!",
  },
  {
    id: 7,
    name: "Najibur Rahman Antor",
    rating: 5,
    feedback: "User-friendly website and fast checkout process. Loved it!",
  },
  {
    id: 8,
    name: "Fahim Shahria",
    rating: 5,
    feedback: "User-friendly website and fast checkout process. Loved it!",
  },
  {
    id: 9,
    name: "Fatema Akter",
    rating: 5,
    feedback: "User-friendly website and fast checkout process. Loved it!",
  },
  {
    id: 10,
    name: "Nafisa Tasnim",
    rating: 5,
    feedback: "User-friendly website and fast checkout process. Loved it!",
  },
];

const CustomerReviews = () => {
  return (
    <section className=" py-5 sm:py-12 px-4 md:px-10 bg-gray-100 rounded-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-gray-800">
        What Our <span className="text-yellow-500">Customers Say</span>
      </h2>

      <div className="overflow-hidden relative">
        <div className="flex gap-6 animate-marquee hover:pause-marquee">
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 sm:w-72 md:w-80 p-6 bg-white rounded-xl shadow-lg text-center"
            >
              <FaUserCircle className="text-gray-400 text-6xl mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-1">{review.name}</h3>

              <div className="flex justify-center mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 text-sm">{review.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .hover\\:pause-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default CustomerReviews;
