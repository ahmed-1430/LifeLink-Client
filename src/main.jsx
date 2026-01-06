import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./app.css";
import ToastContainer from "./Component/ToastContainer";

/* STRIPE */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />

    <Elements stripe={stripePromise}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Elements>

  </React.StrictMode>
);
