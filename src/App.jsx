import { createBrowserRouter, RouterProvider } from "react-router";
import ProtectedRoute from "./Routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>Home</h1>,
  },
  {
    path: "/login",
    element: <h1>Login</h1>,
  },
  {
    path: "/register",
    element: <h1>Register</h1>,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <h1>Dashboard Layout</h1> }
    ],
  },
  {
    element: <ProtectedRoute roles={["admin"]} />,
    children: [
      { path: "/admin", element: <h1>Admin Area</h1> }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
