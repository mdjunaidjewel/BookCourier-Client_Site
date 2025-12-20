// src/Pages/User/MyOrders.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken(true);

        const res = await fetch(
          `http://localhost:3000/api/orders/user/${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load your orders!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = await user.getIdToken(true);

      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );

      Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const handlePayNow = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (orders.length === 0)
    return <p className="text-center mt-10 text-gray-600">No orders found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Book Title</th>
            <th className="p-2 border">Order Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="p-2 border">{order.bookId?.title || "N/A"}</td>
              <td className="p-2 border">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 border capitalize">{order.status}</td>
              <td className="p-2 border capitalize">{order.paymentStatus}</td>
              <td className="p-2 border flex gap-2">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
                    {order.paymentStatus === "unpaid" && (
                      <button
                        onClick={() => handlePayNow(order._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Pay Now
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
