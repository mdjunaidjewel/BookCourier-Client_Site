import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const AddBook = () => {
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState({
    title: "",
    author: "",
    image: "",
    description: "",
    category: "",
    price: "",
    status: "published",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "Login first", "error");

    try {
      const token = await user.getIdToken();

      const res = await fetch("https://bookscourier.vercel.app/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...book,
          price: Number(book.price),
          addedByEmail: user.email,
          addedByName: user.displayName || "Unknown",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Book added successfully", "success");
        setBook({
          title: "",
          author: "",
          image: "",
          description: "",
          category: "",
          price: "",
          status: "published",
        });
      } else {
        Swal.fire("Error", data.error || "Failed to add book", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Book
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Book Title"
          className="input input-bordered w-full"
          required
        />

        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="Author Name"
          className="input input-bordered w-full"
        />

        <input
          name="image"
          value={book.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="input input-bordered w-full"
        />

        <textarea
          name="description"
          value={book.description}
          onChange={handleChange}
          placeholder="Book Description"
          className="textarea textarea-bordered w-full"
          rows="3"
        />

        <input
          name="category"
          value={book.category}
          onChange={handleChange}
          placeholder="Category (e.g. Islamic, Novel)"
          className="input input-bordered w-full"
        />

        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Price
          </label>
          <div className="flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-gray-500 text-lg mr-2">$</span>
            <input
              type="number"
              name="price"
              value={book.price}
              onChange={handleChange}
              min="0"
              placeholder="Enter book price"
              className="w-full py-2 outline-none"
              required
            />
          </div>
        </div>

        <select
          name="status"
          value={book.status}
          onChange={handleChange}
          className="input input-bordered w-full"
        >
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>

        <button type="submit" className="btn btn-primary w-full mt-4">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
