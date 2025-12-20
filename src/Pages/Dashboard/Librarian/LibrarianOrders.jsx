import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";

const LibrarianOrders = () => {
  const { user, token } = useContext(AuthContext); // JWT token from login
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email || !token) return;

      try {
        const res = await fetch(`http://localhost:3000/api/orders/librarian`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

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
  }, [user, token]);

  const handleCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Cancel this order?",
      icon: "warning",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      Swal.fire("Cancelled", "Order cancelled", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      Swal.fire("Success", "Order status updated", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">Loading...</div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Librarian Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders for your books yet.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Book</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td className="p-2 border">{o.bookTitle}</td>
                <td className="p-2 border">{o.name || o.email}</td>
                <td className="p-2 border">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">{o.status}</td>
                <td className="p-2 border flex gap-2">
                  {o.status !== "cancelled" && (
                    <>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o._id, e.target.value)
                        }
                        className="border p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
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
      )}
    </div>
  );
};

export default LibrarianOrders;
