import React, { useState } from "react";
import Swal from "sweetalert2";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    image: "",
    description: "",
    category: "",
    quantity: 1,
    price: 0,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Book added successfully!", "success");
        setBook({
          title: "",
          author: "",
          image: "",
          description: "",
          category: "",
          quantity: 1,
          price: 0,
        });
      } else {
        Swal.fire("Error", data.error || "Something went wrong", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={book.quantity}
              onChange={handleChange}
              min="1"
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
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
