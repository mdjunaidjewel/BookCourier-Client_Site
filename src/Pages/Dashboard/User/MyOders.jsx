import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import { useNavigate } from "react-router";

const MyOrders = () => {
  const { user } = useContext(AuthContext); // Firebase user object
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Firebase JWT token
        const token = await user.getIdToken();

        const res = await fetch(
          `http://localhost:3000/api/orders/user/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch orders");
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Cancel this order?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = await user.getIdToken();

      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to cancel order");
      }

      const updatedOrder = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );

      Swal.fire("Cancelled", "Order cancelled successfully", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">Loading...</div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">
        You have no orders yet.
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Book</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="p-2 border">{o.bookTitle}</td>
              <td className="p-2 border">
                {new Date(o.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2 border">{o.status}</td>
              <td className="p-2 border">{o.paymentStatus}</td>
              <td className="p-2 border flex gap-2">
                {o.status === "pending" && (
                  <>
                    {o.paymentStatus === "unpaid" && (
                      <button
                        onClick={() =>
                          navigate(`/payment/${o._id}`, { state: { order: o } })
                        }
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Pay Now
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(o._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>
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
