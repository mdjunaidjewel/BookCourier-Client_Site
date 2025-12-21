import { useParams, useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });
  const [userRole, setUserRole] = useState("");
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [rating, setRating] = useState(0);

  /* ================= Fetch Book ================= */
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://bookscourier.vercel.app/api/books/${id}`
        );
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setTimeout(() => {
          setBook(data);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error(err);
        setTimeout(() => {
          setBook(null);
          setLoading(false);
        }, 500);
      }
    };
    fetchBook();
  }, [id]);

  /* ================= Fetch User Role & Wishlist ================= */
  useEffect(() => {
    const fetchUserRoleAndWishlist = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken(true);

        const resUser = await fetch(
          `https://bookscourier.vercel.app/api/users/${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = await resUser.json();
        setUserRole(userData?.role || "user");

        const resWishlist = await fetch(
          "https://bookscourier.vercel.app/api/wishlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const wishlistData = await resWishlist.json();
        const exists = wishlistData.some((item) => item.bookId._id === id);
        setWishlistAdded(exists);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserRoleAndWishlist();
  }, [user, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= Place Order ================= */
  const handlePlaceOrder = async () => {
    if (!formData.phone || !formData.address) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }
    if (!user || userRole !== "user") {
      Swal.fire("Access Denied", "Only normal users can place orders", "error");
      return;
    }

    try {
      const token = await user.getIdToken(true);
      const orderData = {
        bookId: book._id,
        bookTitle: book.title,
        name: user.displayName || "User",
        email: user.email,
        phone: formData.phone,
        address: formData.address,
        price: book.price,
      };

      const res = await fetch("https://bookscourier.vercel.app/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Order placed successfully", "success");
        setModalOpen(false);
        setFormData({ phone: "", address: "" });
        navigate("/dashboard/orders");
      } else {
        Swal.fire("Error", data.error || "Failed to place order", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  /* ================= Wishlist ================= */
  const handleWishlist = async () => {
    if (!user) {
      Swal.fire("Error", "Login to add to wishlist", "error");
      return;
    }
    try {
      const token = await user.getIdToken(true);
      const res = await fetch("https://bookscourier.vercel.app/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId: book._id }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Added to wishlist", "success");
        setWishlistAdded(true);
      } else {
        Swal.fire("Error", data.error || "Failed to add wishlist", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  /* ================= Submit Review ================= */
  const handleSubmitReview = async (selectedRating) => {
    if (!user) {
      Swal.fire("Error", "Login to submit review", "error");
      return;
    }

    try {
      const token = await user.getIdToken(true);
      const res = await fetch(
        `https://bookscourier.vercel.app/api/books/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: selectedRating }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", "Review submitted", "success");
        setBook({ ...book, reviews: [...(book.reviews || []), data] });
        setRating(selectedRating);
      } else {
        Swal.fire("Error", data.error || "Failed to submit review", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  /* ================= UI ================= */
  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );

  if (!book)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        Book not found
      </p>
    );

  const averageRating = book.reviews?.length
    ? book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left: Image */}
        <div className="flex-shrink-0 w-full sm:w-48 md:w-56 lg:w-64">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col items-start md:items-start">
          <h2 className="text-2xl sm:text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            <span className="font-semibold">Author:</span> {book.author}
          </p>
          <p className="mt-2 text-gray-500 text-xs sm:text-sm">
            Added by: {book.addedByName || "Unknown"}
          </p>

          <p className="mt-4 font-bold text-green-600 text-base sm:text-lg">
            Price: ${book.price}
          </p>

          <div className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
            {book.description}
          </div>

          {/* Wishlist & Order Buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            {userRole === "user" && (
              <>
                <button
                  onClick={handleWishlist}
                  disabled={wishlistAdded}
                  className={`px-5 py-2 rounded-lg text-white transition cursor-pointer ${
                    wishlistAdded
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {wishlistAdded ? "Wishlisted" : "Add to Wishlist"}
                </button>

                <button
                  onClick={() => setModalOpen(true)}
                  className=" cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Order Now
                </button>
              </>
            )}
          </div>

          {/* Star Rating */}
          {userRole === "user" && (
            <div className="flex items-center gap-2 mt-4">
              <span className="font-semibold">Rate:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmitReview(i)}
                    className={`text-lg cursor-pointer ${
                      rating >= i ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Average Rating Display */}
          <div className="flex items-center gap-1 mt-2">
            <span className="font-semibold">Average Rating:</span>
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-lg ${
                  i <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-gray-600 ml-2">
              ({book.reviews?.length || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* ================= Modal ================= */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-5 rounded-xl shadow-xl w-80 sm:w-96 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="cursor-pointer absolute top-2 right-3 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-lg font-bold mb-4 text-center">
              Place Your Order
            </h2>

            <input
              type="text"
              value={user.displayName || "User"}
              readOnly
              className="w-full border px-3 py-2 mb-3 bg-gray-100 rounded"
            />

            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full border px-3 py-2 mb-3 bg-gray-100 rounded"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border px-3 py-2 mb-4 rounded"
            />

            <button
              onClick={handlePlaceOrder}
              className="cursor-pointer w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
