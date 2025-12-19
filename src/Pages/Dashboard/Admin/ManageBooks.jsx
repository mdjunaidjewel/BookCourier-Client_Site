import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      Swal.fire("Success", `Book ${status}`, "success");
      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? This will delete all orders for this book."
      )
    )
      return;
    try {
      await fetch(`http://localhost:3000/api/books/${id}`, {
        method: "DELETE",
      });
      Swal.fire("Deleted", "Book and its orders deleted", "success");
      fetchBooks();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Books</h2>
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
              <td className="border px-4 py-2">{book.addedByName}</td>
              <td className="border px-4 py-2">{book.status}</td>
              <td className="border px-4 py-2 space-x-2">
                {book.status === "published" ? (
                  <button
                    onClick={() => handleStatusChange(book._id, "unpublished")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(book._id, "published")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooks;
