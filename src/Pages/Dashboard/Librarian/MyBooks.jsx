import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load all books
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/books");
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Toggle publish/unpublish
  const handleToggleStatus = async (book) => {
    try {
      const updatedBook = {
        status: book.status === "published" ? "unpublished" : "published",
      };

      const res = await fetch(`http://localhost:3000/api/books/${book._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });

      if (res.ok) {
        Swal.fire("Success", `Book is now ${updatedBook.status}`, "success");
        fetchBooks();
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Books</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Book Name</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="text-center">
                <td className="px-4 py-2 border">{book.title}</td>
                <td className="px-4 py-2 border">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-16 object-cover mx-auto"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-4 py-2 border capitalize">{book.status}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleToggleStatus(book)}
                    className={`px-3 py-1 rounded text-white ${
                      book.status === "published"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {book.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => navigate(`/edit-book/${book._id}`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBooks;
