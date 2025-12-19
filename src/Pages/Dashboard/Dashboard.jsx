import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { AuthContext } from "../../Components/Providers/AuthContext/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handlePayNow = (order) => {
    navigate(`/payment/${order._id}`, { state: { order } });
  };

  // Sidebar items
  const sidebarItems = [
    { label: "My Orders", path: "/dashboard" },
    { label: "My Profile", path: "/dashboard/profile" },
    { label: "Invoice", path: "/dashboard/invoice" },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
            <span>☰</span>
          </label>
          <div className="px-4 font-bold text-lg">User Dashboard</div>
        </nav>

        {/* Main content */}
        <div className="p-4 flex-1 overflow-auto">
          {/* Orders table on default route */}
          {location.pathname === "/dashboard" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">My Orders</h1>
              {loading ? (
                <p>Loading orders...</p>
              ) : (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.bookTitle}</td>
                        <td>{order.status}</td>
                        <td>{order.paymentStatus}</td>
                        <td>${order.price}</td>
                        <td>
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
          )}

          {/* Render child route content (Profile / Invoice) */}
          <Outlet context={{ orders, loading }} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
        <div className="bg-base-200 w-64 p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.path}
              className={`w-full text-left mb-1 ${
                location.pathname === item.path ? "font-bold bg-base-300" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
