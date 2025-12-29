import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* Layouts */
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

/* Route Guards */
import ProtectedRoute from "./Routes/ProtectedRoute";

/* Public Pages */
import Home from "./pages/Home";
import Search from "./pages/Search";
import PublicRequests from "./pages/PublicRequests";
import RequestDetails from "./pages/RequestDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

/* Dashboard Pages */
import DonorHome from "./pages/Dashboard/DonorHome";
import MyDonationRequests from "./pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "./pages/Dashboard/CreateDonationRequest";
import AllBloodDonationRequests from "./pages/Dashboard/AllBloodDonationRequests";
import Funding from "./pages/Dashboard/Funding";
import AllUsers from "./pages/Dashboard/AllUsers";

const router = createBrowserRouter([
  /* ===============================
     PUBLIC ROUTES
  ================================ */
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/requests", element: <PublicRequests /> },
      { path: "/requests/:id", element: <RequestDetails /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  /* ===============================
     DASHBOARD ROUTES (AUTH USERS)
  ================================ */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DonorHome /> },
          { path: "requests", element: <MyDonationRequests /> },
          { path: "create", element: <CreateDonationRequest /> },
          { path: "all-requests", element: <AllBloodDonationRequests /> },
          { path: "funding", element: <Funding /> },

          /* ADMIN ONLY */
          {
            path: "users",
            element: (
              <ProtectedRoute roles={["admin"]}>
                <AllUsers />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
