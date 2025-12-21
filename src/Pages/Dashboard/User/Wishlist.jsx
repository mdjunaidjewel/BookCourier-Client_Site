import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= Fetch Wishlist ================= */
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken(true);
        const res = await fetch("http://localhost:3000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  /* ================= Remove from Wishlist ================= */
  const handleRemove = async (wishlistId) => {
    const confirm = await Swal.fire({
      title: "Remove from wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (confirm.isConfirmed) {
      try {
        const token = await user.getIdToken(true);
        const res = await fetch(
          `http://localhost:3000/api/wishlist/${wishlistId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          setWishlist(wishlist.filter((item) => item._id !== wishlistId));
          Swal.fire("Removed!", "Book removed from wishlist.", "success");
        } else {
          Swal.fire("Error", "Failed to remove book", "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading wishlist...</p>;
  if (!wishlist.length)
    return (
      <p className="text-center mt-10 text-gray-500">
        No books in your wishlist
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-5 text-center">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-xl shadow-md">
            <img
              src={item.bookId.image}
              alt={item.bookId.title}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-2 font-semibold text-lg">{item.bookId.title}</h3>
            <p className="text-gray-600 text-sm">
              Author: {item.bookId.author}
            </p>
            <p className="text-green-600 font-bold mt-1">
              ${item.bookId.price}
            </p>
            <button
              onClick={() => handleRemove(item._id)}
              className=" cursor-pointer mt-3 w-full bg-red-600 text-white py-1 rounded hover:bg-red-700 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
