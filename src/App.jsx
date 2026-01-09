import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './app.css'

/* Layouts */
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

/* Guards */
import ProtectedRoute from "./Routes/ProtectedRoute";

/* Public Pages */
import Home from "./pages/Home";
import Search from "./pages/Search";
import PublicRequests from "./pages/PublicRequests";
import RequestDetails from "./pages/RequestDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

/* Dashboard Pages */
import DashboardIndex from "./pages/Dashboard/DashboardIndex";
import MyDonationRequests from "./pages/Dashboard/MyRequests";
import CreateDonationRequest from "./pages/Dashboard/CreateRequest";
import AllBloodDonationRequests from "./pages/Dashboard/AllRequests";
import Funding from "./pages/Dashboard/Funding";

/* Admin Pages */
import AllUsers from "./pages/Dashboard/AllUsers";

/* Profile */
import ProfilePage from "./pages/Profile/ProfilePage";
import DonationRequestDetails from "./pages/Dashboard/DonationRequestDetails";

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
     DASHBOARD (AUTHENTICATED)
  ================================ */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardIndex /> },

          { path: "requests", element: <MyDonationRequests /> },
          { path: "create", element: <CreateDonationRequest /> },
          { path: "all-requests", element: <AllBloodDonationRequests /> },
          { path: "funding", element: <Funding /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "requests/:id", element: <DonationRequestDetails /> },

          {
            path: "all-users",
            element: <AllUsers />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
