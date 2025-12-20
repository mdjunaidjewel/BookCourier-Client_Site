import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const MyBooks = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBooks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken(true);

        const res = await fetch("http://localhost:3000/api/books/librarian", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetch status:", res.status);

        if (!res.ok) {
          const errText = await res.text();
          console.error("Backend error:", errText);
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        console.log("Fetched books:", data);

        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to load your books!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user]);

  const handleUnpublish = async (bookId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This book will be unpublished",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unpublish",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = await user.getIdToken(true);

      const res = await fetch(`http://localhost:3000/api/books/${bookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "unpublished" }),
      });

      if (!res.ok) throw new Error("Unpublish failed");

      const updatedBook = await res.json();
      setBooks((prev) => prev.map((b) => (b._id === bookId ? updatedBook : b)));

      Swal.fire("Success!", "Book unpublished", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!books.length)
    return (
      <p className="text-center mt-10 text-gray-600">No books added yet.</p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Books</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Author</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td className="p-2 border">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="p-2 border">{book.title}</td>
              <td className="p-2 border">{book.author}</td>
              <td className="p-2 border">${book.price}</td>
              <td className="p-2 border capitalize">{book.status}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => navigate(`/dashboard/edit-book/${book._id}`)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                {book.status === "published" && (
                  <button
                    onClick={() => handleUnpublish(book._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Unpublish
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBooks;
