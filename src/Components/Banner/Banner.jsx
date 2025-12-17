import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const Banner = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load books from public JSON
  useEffect(() => {
    fetch("/Books.json")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  // Auto slide every 4s
  useEffect(() => {
    if (books.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [books]);

  if (books.length === 0) return <p>Loading...</p>;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ backgroundColor: "#00453e" }}
    >
      {/* Slider Wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${books.length * 100}%`,
          transform: `translateX(-${currentIndex * (100 / books.length)}%)`,
        }}
      >
        {books.map((book) => (
          <div
            key={book.bookId}
            className="w-full flex-shrink-0"
            style={{ width: `${100 / books.length}%` }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-4 md:px-20 py-6 md:py-0 min-h-[400px] md:min-h-[450px] text-white">
              {/* Book Image */}
              <div className="flex-shrink-0 w-36 h-48 md:w-56 md:h-72 lg:w-64 lg:h-80">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </div>

              {/* Text Content */}
              <div className="max-w-xl text-center md:text-left flex flex-col justify-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-3">
                  {book.title}
                </h2>

                <p className="text-gray-200 mb-2">
                  {book.description.slice(0, 90)}...
                </p>

                {/* Author Name */}
                <p className="text-gray-300 italic mb-5">By {book.author}</p>

                <Link
                  to="/books"
                  className="btn btn-primary self-center md:self-start"
                >
                  View All Books
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={() =>
          setCurrentIndex(
            currentIndex === 0 ? books.length - 1 : currentIndex - 1
          )
        }
        className="btn btn-circle absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % books.length)}
        className="btn btn-circle absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white"
      >
        ❯
      </button>
    </div>
  );
};

export default Banner;
