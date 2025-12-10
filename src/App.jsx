import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";




const router = createBrowserRouter([
  {
    element: <PublicLayout/>,   
    children: [
      { path: "/", element: <h1>Home</h1> },
      { path: "/login", element: <h1>Login</h1> },
      { path: "/register", element: <h1>register</h1> },
    ],
  },

  {
    element: <ProtectedRoute />,  
    children: [
      {
        path: "/dashboard",
        element: <h1>appshell</h1>,   // 
        children: [
          { index: true, element: <h1>donor home page</h1> },
          { path: "requests", element: <h1>My requests</h1> },
          { path: "create", element: <h1>Create Request</h1> },
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
