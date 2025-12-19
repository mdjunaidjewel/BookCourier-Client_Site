import { useParams } from "react-router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider"; // Firebase auth context
import Swal from "sweetalert2";

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });

  // Fetch single book
  useEffect(() => {
    fetch(`http://localhost:3000/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
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

    const orderData = {
      bookId: book._id,
      bookTitle: book.title,
      name: user?.displayName || "",
      email: user?.email || "",
      phone: formData.phone,
      address: formData.address,
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
      })
      .catch(() => {
        Swal.fire("Error", "Failed to place order", "error");
      });
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      {/* Book Details */}
      <img
        src={book.image}
        alt={book.title}
        className="w-full rounded shadow-lg"
      />
      <h2 className="text-2xl font-bold mt-4">{book.title}</h2>
      <p className="text-gray-600">{book.author}</p>
      <p className="mt-4">{book.description}</p>

      {/* Order Now Button */}
      <button
        onClick={() => setModalOpen(true)}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
      >
        Order Now
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Place Your Order</h2>
            <form>
              {/* Name (readonly) */}
              <div className="mb-3">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              {/* Email (readonly) */}
              <div className="mb-3">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="block mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter your address"
                />
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                Order Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
