import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router";

const Orders = () => {
  const { user, role } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/orders/user/${user.email}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchOrders();
  }, [user]);

  // Cancel order
  const handleCancel = async (orderId) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/orders/${orderId}`,
        { status: "cancelled" }
      );
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data : order))
      );
    } catch (err) {
      console.error("Failed to cancel order:", err.message);
    }
  };

  // Pay now
  const handlePayNow = (order) => {
    navigate(`/payment/${order._id}`, { state: { order } });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading orders...</p>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Book</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.bookTitle}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status}</td>
                <td>{order.paymentStatus}</td>
                <td className="flex gap-2">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="btn btn-sm btn-error"
                      >
                        Cancel
                      </button>
                      {order.paymentStatus === "unpaid" && (
                        <button
                          onClick={() => handlePayNow(order)}
                          className="btn btn-sm btn-success"
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
      )}
    </div>
  );
};

export default Orders;
