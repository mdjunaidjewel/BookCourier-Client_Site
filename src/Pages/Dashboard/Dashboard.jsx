import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("orders"); // orders, profile, invoice
  const navigate = useNavigate();

  // Fetch user orders
  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/api/orders/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, [user]);

  // Cancel order
  const handleCancel = (orderId) => {
    fetch(`http://localhost:3000/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    })
      .then((res) => res.json())
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      });
  };

  // Pay now
  const handlePayNow = (orderId) => {
    navigate(`/payment/${orderId}`);
  };

  // Sidebar items
  const sidebarItems = [
    { label: "My Orders", key: "orders" },
    { label: "My Profile", key: "profile" },
    { label: "Invoice", key: "invoice" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 font-bold text-lg">User Dashboard</div>
        </nav>

        {/* Main Content */}
        <div className="p-4 flex-1 overflow-auto">
          {activePage === "orders" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">My Orders</h1>
              {loading ? (
                <p>Loading orders...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Book Title</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.bookTitle}</td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>{order.status}</td>
                          <td>{order.paymentStatus}</td>
                          <td className="flex gap-2">
                            {order.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleCancel(order._id)}
                                  className="btn btn-sm btn-error cursor-pointer"
                                >
                                  Cancel
                                </button>
                                {order.paymentStatus === "unpaid" && (
                                  <button
                                    onClick={() =>
                                      navigate(`/payment/${order._id}`)
                                    }
                                    className="btn btn-sm btn-success cursor-pointer"
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
                  {orders.length === 0 && (
                    <p className="mt-4">You have no orders yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activePage === "profile" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">My Profile</h1>
              <p>Profile update form goes here.</p>
            </div>
          )}

          {activePage === "invoice" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Invoice</h1>
              <p>Invoice details page goes here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col bg-base-200 w-64">
          <ul className="menu w-full p-2">
            {sidebarItems.map((item) => (
              <li key={item.key}>
                <button
                  className={`w-full text-left ${
                    activePage === item.key ? "bg-base-300 font-bold" : ""
                  }`}
                  onClick={() => setActivePage(item.key)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
