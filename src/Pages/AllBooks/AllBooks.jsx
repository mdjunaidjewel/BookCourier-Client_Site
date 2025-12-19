import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      });
  }, []);

  // 🔄 Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {books.map((book) => (
        <div
          key={book._id}
          onClick={() => navigate(`/books/${book._id}`)}
          className="card shadow-lg cursor-pointer hover:scale-105 transition"
        >
          <img
            src={book.image}
            alt={book.title}
            className="h-64 w-full object-cover"
          />
          <div className="p-4">
            <h2 className="font-bold text-lg">{book.title}</h2>
            <p className="text-gray-600">{book.author}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllBooks;
