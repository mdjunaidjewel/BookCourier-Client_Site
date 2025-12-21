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
        const res = await fetch(
          "https://bookscourier.vercel.app/api/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setWishlist(Array.isArray(data) ? data : []);
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
          `https://bookscourier.vercel.app/api/wishlist/${wishlistId}`,
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
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-5 text-center">My Wishlist</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Author</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item) => (
              <tr key={item._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {item.bookId?.image ? (
                    <img
                      src={item.bookId.image}
                      alt={item.bookId.title || "Book Image"}
                      className="h-16 w-16 object-cover mx-auto rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {item.bookId?.title || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  {item.bookId?.author || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-green-600 font-semibold">
                  ${item.bookId?.price?.toFixed(2) || "0.00"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="cursor-pointer bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                  >
                    Remove
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

export default Wishlist;
