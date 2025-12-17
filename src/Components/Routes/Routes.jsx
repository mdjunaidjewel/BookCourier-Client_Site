import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../../Pages/Home";
import Login from "../../Pages/Login/Login";
import Register from "../../Pages/Register/Register";
import Profile from "../../Pages/Profile/Profile";

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
            path: '/login',
            element:<Login></Login>
        },
        {
            path: '/register',
            element:<Register></Register>
        },
        {
            path: 'profile',
            element:<Profile></Profile>
        }
        ],
  },
]);

export default router;
