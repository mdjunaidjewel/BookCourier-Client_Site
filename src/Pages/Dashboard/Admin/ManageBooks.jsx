import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";

const ManageBooks = () => {
  const { jwtToken } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const API_URL = "https://bookscourier.vercel.app";

  // ================= FETCH ALL BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/books/all`, {
        // নতুন route
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  useEffect(() => {
    if (jwtToken) fetchBooks();
  }, [jwtToken]);

  // ================= PUBLISH / UNPUBLISH =================
  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      Swal.fire("Success", `Book ${status}`, "success");

      setBooks((prevBooks) =>
        prevBooks.map((book) => (book._id === id ? { ...book, status } : book))
      );
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // ================= DELETE BOOK =================
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Deleting this book will also delete all its orders!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(`${API_URL}/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      Swal.fire("Deleted", "Book and its orders deleted", "success");
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Books</h2>

      {books.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No books added yet</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Added By</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.addedByEmail}</td>
                <td className="border px-4 py-2 capitalize">{book.status}</td>
                <td className="border px-4 py-2 space-x-2">
                  <select
                    value={book.status}
                    onChange={(e) =>
                      handleStatusChange(book._id, e.target.value)
                    }
                    className="border px-2 py-1 rounded bg-white cursor-pointer"
                  >
                    <option value="published">Publish</option>
                    <option value="unpublished">Unpublish</option>
                  </select>

                  <button
                    onClick={() => handleDelete(book._id)}
                    className="ml-2 cursor-pointer px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageBooks;
