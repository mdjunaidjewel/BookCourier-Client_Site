import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../../Pages/Home";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import Profile from "../../Pages/Profile/Profile";
import NotFound from "../../Pages/NotFound/NotFound";
import PrivateRoute from "../PrivateRoute/PrivateRout";
import AllBooks from "../../Pages/AllBooks/AllBooks";

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
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: '/books',
        element:<AllBooks></AllBooks>
      },
      // Protected route
      {
        element: <PrivateRoute />, // wrapper
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;
