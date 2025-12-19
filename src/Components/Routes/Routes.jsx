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
import Invoice from "../../Pages/Invoice/Invoice";
import Orders from "../../Pages/Dashboard/Librarian/Orders";
import AddBook from "../../Pages/Dashboard/Librarian/AddBook";
import MyBooks from "../../Pages/Dashboard/Librarian/MyBooks";
import ManageBooks from "../../Pages/Dashboard/Admin/ManageBooks";
import AllUsers from "../../Pages/Dashboard/Admin/AllUsers";

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
            path: "books/:id",
            element: <BookDetails />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
            children: [
              {
                path: "profile", // relative path
                element: <Profile />,
              },
              {
                path: "invoice", // future invoice page
                element: <Invoice></Invoice>
              },
              {
                path: 'orders',
                element:<Orders></Orders>
              },

              // Add book for Librarian
              {
                path: 'add-book',
                element:<AddBook></AddBook>
              },
              {
                path: 'my-books',
                element:<MyBooks></MyBooks>
              },

              // Admin book manage
              {
                path: 'books',
                element: <ManageBooks></ManageBooks>
              },
              {
                path: 'users',
                element:<AllUsers></AllUsers>
              }
            ],
          },
          {
            path: "payment/:orderId",
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
