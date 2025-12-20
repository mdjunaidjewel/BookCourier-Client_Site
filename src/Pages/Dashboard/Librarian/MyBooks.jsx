import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const MyBooks = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:3000/api/books/librarian", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // ensure data is array
        if (Array.isArray(data)) setBooks(data);
        else setBooks([]);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch books", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  const handleEdit = (bookId) => {
    navigate(`/dashboard/edit-book/${bookId}`);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Books</h2>
      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books added yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">
                  {book.image && (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-16 h-16 object-cover"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 capitalize">{book.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(book._id)}
                    className="px-4 py-1 bg-green-600 text-white rounded"
                  >
                    Edit
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

export default MyBooks;
