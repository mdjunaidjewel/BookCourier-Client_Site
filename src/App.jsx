import { RouterProvider } from "react-router";
import router from "./Components/Routes/Routes";
import AuthProvider from "./Components/Providers/AuthContext/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
