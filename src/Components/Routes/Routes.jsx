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

// Librarian
import OrdersLibrarian from "../../Pages/Dashboard/Librarian/LibrarianOrders";
import AddBook from "../../Pages/Dashboard/Librarian/AddBook";
import MyBooks from "../../Pages/Dashboard/Librarian/MyBooks";

// Admin
import ManageBooks from "../../Pages/Dashboard/Admin/ManageBooks";
import AllUsers from "../../Pages/Dashboard/Admin/AllUsers";

// Edit book (Librarian)
import EditBook from "../../Pages/Dashboard/EditBook/EditBook";

// User Orders
import OrdersUser from "../../Pages/Dashboard/User/MyOders";
import Invoice from "../../Pages/Dashboard/User/Invoice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // ---------- PUBLIC BOOK ROUTES ----------
      { path: "books", element: <AllBooks /> },

      // ---------- PRIVATE ROUTES ----------
      {
        element: <PrivateRoute />,
        children: [
          { path: "books/:id", element: <BookDetails /> },

          // ---------- DASHBOARD ----------
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              // ----- USER -----
              {
                path: "orders",
                element: <OrdersUser />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "invoice",
                element: <Invoice />,
              },

              // ----- LIBRARIAN -----
              {
                path: "add-book",
                element: <AddBook />,
              },
              {
                path: "my-books",
                element: <MyBooks />,
              },
              {
                path: "librarian-orders",
                element: <OrdersLibrarian />,
              },
              {
                path: "edit-book/:id",
                element: <EditBook />,
              },

              // ----- ADMIN -----
              {
                path: "admin/books",
                element: <ManageBooks />,
              },
              {
                path: "admin/users",
                element: <AllUsers />,
              },
              {
                path: "admin/orders",
                element: <OrdersLibrarian />, // Admin can see all orders
              },
            ],
          },

          // ---------- PAYMENT ----------
          {
            path: "payment/:orderId",
            element: <Payment />,
          },
        ],
      },
    ],
  },

  // ---------- NOT FOUND ----------
  { path: "*", element: <NotFound /> },
]);

export default router;
