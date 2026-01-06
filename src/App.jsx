import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
          /* ROLE-BASED HOME */
          { index: true, element: <DashboardIndex /> },

          /* COMMON */
          { path: "requests", element: <MyDonationRequests /> },
          { path: "create", element: <CreateDonationRequest /> },
          { path: "all-requests", element: <AllBloodDonationRequests /> },
          { path: "funding", element: <Funding /> },
          { path: "profile", element: <ProfilePage /> },

          /* ADMIN ONLY */
          {
            path: "all-users",
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
