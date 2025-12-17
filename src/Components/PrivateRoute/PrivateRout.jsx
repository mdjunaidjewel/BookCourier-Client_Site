import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../Providers/AuthContext/AuthProvider";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Optional: spinner বা loader দেখাতে পারেন
  }

  // যদি user না থাকে, হোম বা login page এ redirect করবে
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user থাকলে children / outlet render হবে
  return <Outlet />;
};

export default PrivateRoute;
