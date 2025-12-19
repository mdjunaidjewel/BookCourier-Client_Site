import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../../Pages/Home";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import Profile from "../../Pages/Profile/Profile";
import NotFound from "../../Pages/NotFound/NotFound";
import PrivateRoute from "../PrivateRoute/PrivateRout";
import AllBooks from "../../Pages/AllBooks/AllBooks";
import BookDetails from "../../Pages/AllBooks/BookDetails";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import Payment from "../Payment/Payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },

      // ---------- BOOK ROUTES ----------
      {
        path: "books",
        element: <AllBooks />,
      },

      // ---------- PRIVATE ROUTES ----------
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "books/:id",
            element: <BookDetails />,
          },
          {
            path: "/dashboard",
            element: <Dashboard></Dashboard>,
          },
          {
            path: "payment/:orderId", // <-- new payment route
            element: <Payment />,
          },
        ],
      },
    ],
  },

  // ---------- NOT FOUND ----------
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
