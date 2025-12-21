import React, { useEffect, useState } from "react";
import { FaBook, FaUsers, FaTruck, FaStar } from "react-icons/fa";

const statsData = [
  {
    id: 1,
    title: "Books Delivered",
    value: 12000,
    icon: <FaBook />,
  },
  {
    id: 2,
    title: "Happy Customers",
    value: 5800,
    icon: <FaUsers />,
  },
  {
    id: 3,
    title: "On-time Delivery",
    value: 99,
    suffix: "%",
    icon: <FaTruck />,
  },
  {
    id: 4,
    title: "Customer Rating",
    value: 4.9,
    suffix: "/5",
    icon: <FaStar />,
  },
];

const Counter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 20);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Number(start.toFixed(1)));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const PlatformStatistics = () => {
  return (
    <section className=" py-6 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Our <span className="text-blue-600">Platform Statistics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="bg-gray-100 rounded-xl p-6 text-center shadow hover:shadow-lg transition"
            >
              <div className="text-yellow-600 text-4xl mb-4 flex justify-center">
                {stat.icon}
              </div>

              <h3 className=" text-2xl sm:text-3xl font-bold text-gray-800">
                <Counter end={stat.value} />
                {stat.suffix || "+"}
              </h3>

              <p className="text-gray-600 mt-2">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;
