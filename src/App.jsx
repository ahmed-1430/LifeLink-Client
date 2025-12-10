import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import DonorHome from "./pages/Dashboard/DonorHome";
import MyRequests from "./pages/Dashboard/MyRequests";
import CreateRequest from "./pages/Dashboard/CreateRequest";
import Login from "./pages/Auth/Login";




const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login/>},
      { path: "/register", element: <h1>register</h1> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <h1>appshell</h1>,
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
