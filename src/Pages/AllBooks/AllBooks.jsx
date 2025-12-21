import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // none, asc, desc
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://bookscourier.vercel.app/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setFilteredBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter & Sort
  useEffect(() => {
    let updatedBooks = [...books];

    if (search.trim()) {
      updatedBooks = updatedBooks.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOrder === "asc") {
      updatedBooks.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      updatedBooks.sort((a, b) => b.price - a.price);
    }

    setFilteredBooks(updatedBooks);
  }, [search, sortOrder, books]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-cyan-400"></span>
      </div>
    );
  }

  if (!books.length) {
    return (
      <p className="text-center text-gray-400 mt-10 font-semibold text-lg">
        No books available.
      </p>
    );
  }

  const getAverageRating = (reviews) => {
    if (!reviews || !reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
  };

  return (
    <div className="p-4">
      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row justify-end sm:justify-end gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full sm:w-64"
        />
        <div className="relative w-full sm:w-40 mt-2 sm:mt-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="input input-bordered sm:w-full appearance-none pr-6"
          >
            <option value="none">Sort by Price</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const avgRating = getAverageRating(book.reviews);
          return (
            <div
              key={book._id}
              onClick={() => navigate(`/books/${book._id}`)}
              className="relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              {/* Book Image */}
              <div className="relative w-full overflow-hidden rounded-t-xl h-64 sm:h-72 md:h-64 lg:h-72 bg-gray-100 flex items-center justify-center">
                <img
                  src={book.image || "/placeholder.png"}
                  alt={book.title}
                  className="max-h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-2 text-white">
                  <p className="text-xs italic">
                    Category: {book.category || "Uncategorized"}
                  </p>
                  <p className="text-sm font-semibold truncate">{book.title}</p>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-3 bg-gray-50">
                <p className="text-gray-700 text-sm mb-1 truncate italic">
                  By: {book.author}
                </p>
                <p className="text-green-600 font-semibold text-base">
                  ${book.price}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Published:{" "}
                  {new Date(book.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {/* Average Rating */}
                <div className="mt-2 flex items-center gap-1 italic text-yellow-700 text-sm">
                  Ratings:
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`text-base ${
                        i <= Math.round(avgRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-gray-600 text-xs">
                    ({book.reviews?.length || 0})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-400 mt-10 font-semibold text-lg">
          No books match your search.
        </p>
      )}
    </div>
  );
};

export default AllBooks;
