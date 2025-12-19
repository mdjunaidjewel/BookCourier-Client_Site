import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";

const Invoice = () => {
  const { user } = useContext(AuthContext);
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/api/orders/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        // filter only paid orders
        const paid = data.filter((order) => order.paymentStatus === "paid");
        setPaidOrders(paid);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
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
                <td>{order._id}</td> {/* Using order ID as Payment ID */}
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
