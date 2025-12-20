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
    quantity: 1,
    price: 0,
    status: "published",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "Login first", "error");

    const token = await user.getIdToken();
    try {
      // Send both email and name to backend
      const res = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...book,
          addedByEmail: user.email,
          addedByName: user.displayName || "Unknown", // ✨ নাম পাঠাচ্ছি
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
          quantity: 1,
          price: 0,
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={book.title}
          onChange={handleChange}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />
        <input
          name="author"
          value={book.author}
          onChange={handleChange}
          placeholder="Author"
          className="input input-bordered w-full"
        />
        <input
          name="image"
          value={book.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="input input-bordered w-full"
        />
        <input
          name="description"
          value={book.description}
          onChange={handleChange}
          placeholder="Description"
          className="input input-bordered w-full"
        />
        <input
          name="category"
          value={book.category}
          onChange={handleChange}
          placeholder="Category"
          className="input input-bordered w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="quantity"
            value={book.quantity}
            onChange={handleChange}
            min="1"
            className="input input-bordered w-full"
            placeholder="Quantity"
          />
          <input
            type="number"
            name="price"
            value={book.price}
            onChange={handleChange}
            min="0"
            className="input input-bordered w-full"
            placeholder="Price"
          />
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
        <button type="submit" className="btn btn-primary w-full mt-2">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
