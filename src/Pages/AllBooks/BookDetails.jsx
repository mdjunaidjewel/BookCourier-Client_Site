import { useParams } from "react-router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ phone: "", address: "" });

  // Fetch book details
  useEffect(() => {
    fetch(`http://localhost:3000/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!formData.phone || !formData.address) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    // Only normal users can place order
    if (user?.role !== "user") {
      Swal.fire("Access Denied", "Only normal users can place orders", "error");
      return;
    }

    const orderData = {
      bookId: book._id,
      bookTitle: book.title,
      name: user?.displayName,
      email: user?.email,
      phone: formData.phone,
      address: formData.address,
      price: book.price,
    };

    fetch("http://localhost:3000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire("Success", "Order placed successfully", "success");
        setModalOpen(false);
        setFormData({ phone: "", address: "" });
        navigate("/dashboard");
      })
      .catch(() => Swal.fire("Error", "Failed to place order", "error"));
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!book)
    return <p className="text-center mt-10 text-red-500">Book not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <img
        src={book.image}
        alt={book.title}
        className="w-full rounded shadow-lg"
      />
      <h2 className="text-2xl font-bold mt-4">{book.title}</h2>
      <p className="text-gray-700">{book.author}</p>
      <p className="mt-4">{book.description}</p>
      <p className="mt-2 font-bold text-green-600">Price: ${book.price}</p>

      {/* Added by */}
      <p className="mt-2 text-gray-600">
        Added by: {book.addedByName || "Unknown"}
      </p>

      {/* Order button only for normal users */}
      {user?.role === "user" && (
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Order Now
        </button>
      )}

      {/* Modal for placing order */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Place Your Order</h2>

            <input
              type="text"
              value={user?.displayName}
              readOnly
              className="w-full border px-3 py-2 mb-3 bg-gray-100"
            />
            <input
              type="email"
              value={user?.email}
              readOnly
              className="w-full border px-3 py-2 mb-3 bg-gray-100"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border px-3 py-2 mb-3"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border px-3 py-2 mb-3"
            />

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
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
