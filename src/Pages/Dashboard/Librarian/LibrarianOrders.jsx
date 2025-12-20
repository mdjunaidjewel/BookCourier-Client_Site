import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";

const LibrarianOrders = () => {
  const { jwtToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000";

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders/librarian`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jwtToken) fetchOrders();
  }, [jwtToken]);

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_URL}/api/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be cancelled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
    });

    if (!confirm.isConfirmed) return;

    updateStatus(id, "cancelled");
  };

  // ================= UI =================
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!orders.length)
    return <p className="text-center mt-10">No orders found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Book</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border px-4 py-2">{order.bookId?.title}</td>

                <td className="border px-4 py-2">{order.name}</td>

                <td className="border px-4 py-2">${order.price}</td>

                {/* STATUS DROPDOWN */}
                <td className="border px-4 py-2">
                  {order.status === "cancelled" ? (
                    <span className="text-red-500 font-semibold">
                      Cancelled
                    </span>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </td>

                {/* ACTION */}
                <td className="border px-4 py-2">
                  {order.status !== "cancelled" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LibrarianOrders;
