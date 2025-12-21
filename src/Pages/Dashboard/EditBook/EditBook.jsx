import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const EditBook = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // book id
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    image: "",
    description: "",
    category: "",
    price: 0,
    status: "published",
  });
  const [loading, setLoading] = useState(true);

  // Fetch book data
  const fetchBook = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `https://bookscourier.vercel.app/api/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setBook(data);
      } else {
        Swal.fire("Error", data.error || "Failed to fetch book", "error");
        navigate("/dashboard/my-books");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `https://bookscourier.vercel.app/api/books/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(book),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Book updated successfully!", "success");
        navigate("/dashboard/my-books");
      } else {
        Swal.fire("Error", data.error || "Failed to update book", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            value={book.image}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={book.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={book.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Price ($)</label>
          <input
            type="number"
            name="price"
            value={book.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={book.status}
            onChange={handleChange}
            className=" cursor-pointer w-full border p-2 rounded"
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
