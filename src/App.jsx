import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import DonorHome from "./pages/Dashboard/DonorHome";
import MyRequests from "./pages/Dashboard/MyRequests";
import CreateRequest from "./pages/Dashboard/CreateRequest";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";




const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DonorHome /> },
          { path: "requests", element: <MyRequests /> },
          { path: "create", element: <CreateRequest /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute roles={["admin"]} />,
    children: [{ path: "/admin", element: <div>Admin Area</div> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
