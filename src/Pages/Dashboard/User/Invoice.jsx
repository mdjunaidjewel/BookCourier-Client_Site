import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Components/Providers/AuthContext/AuthProvider";
import Swal from "sweetalert2";

const Invoice = () => {
  const { user } = useContext(AuthContext);
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaidOrders = async () => {
      if (!user?.email) return;

      try {
        const token = await user.getIdToken(); // Firebase JWT
        const res = await fetch(
          `http://localhost:3000/api/orders/user/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        const paid = data.filter((order) => order.paymentStatus === "paid");
        setPaidOrders(paid);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPaidOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full mt-10">
        <span className="loading loading-spinner loading-xl text-cyan-600"></span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">My Payments / Invoices</h1>

      {paidOrders.length === 0 ? (
        <p className="text-gray-600">You have no payments yet.</p>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Name</th>
              <th>Payment ID</th>
              <th>Amount ($)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paidOrders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.bookTitle || "N/A"}</td>
                <td>{order._id}</td> {/* Order ID as Payment ID */}
                <td>{order.price}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Invoice;
