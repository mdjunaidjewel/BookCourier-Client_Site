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

        const res = await fetch(
          "https://bookscourier.vercel.app/api/books/librarian",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();
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

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!books.length)
    return (
      <p className="text-center mt-10 text-gray-600">No books added yet.</p>
    );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Books</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50 transition">
                <td className="p-3">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-3 font-medium text-gray-700">{book.title}</td>
                <td className="p-3 text-gray-600">{book.author}</td>
                <td className="p-3 text-gray-600">${book.price}</td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-white font-semibold ${
                      book.status === "published"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => navigate(`/dashboard/edit-book/${book._id}`)}
                    className=" cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBooks;
