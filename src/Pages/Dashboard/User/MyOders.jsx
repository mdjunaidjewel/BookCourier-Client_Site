import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentStyle = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-red-100 text-red-700",
};

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
          `https://bookscourier.vercel.app/api/orders/user/${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        Swal.fire("Error", "Failed to load your orders", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = await user.getIdToken(true);
      const res = await fetch(
        `https://bookscourier.vercel.app/api/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!res.ok) throw new Error("Cancel failed");

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );

      Swal.fire("Cancelled!", "Order has been cancelled", "success");
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
  };

  const handlePayNow = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-cyan-600"></span>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-2xl font-semibold mb-2">No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 border">
        <h2 className="text-3xl font-bold text-cyan-700 mb-6">My Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-cyan-100 text-cyan-800">
                <th className="p-3 text-left">Book</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">
                    {order.bookId?.title || "N/A"}
                  </td>

                  <td className="p-3 text-center text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        statusStyle[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        paymentStyle[order.paymentStatus]
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    {order.status === "pending" && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleCancel(order._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                        >
                          Cancel
                        </button>

                        {order.paymentStatus === "unpaid" && (
                          <button
                            onClick={() => handlePayNow(order._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
