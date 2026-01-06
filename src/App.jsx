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
import MyDonationRequests from "./pages/Dashboard/MyRequests";
import CreateDonationRequest from "./pages/Dashboard/CreateRequest";
import AllBloodDonationRequests from "./pages/Dashboard/AllRequests";
import Funding from "./pages/Dashboard/Funding";

/* Admin Pages */
import AllUsers from "./pages/Dashboard/AllUsers";
import ProfilePage from "./pages/Profile/ProfilePage";

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
     AUTHENTICATED DASHBOARD
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
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },

  /* ===============================
     ADMIN ONLY ROUTES
  ================================ */
  {
    element: <ProtectedRoute roles={["admin"]} />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { path: "all-users", element: <AllUsers /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
