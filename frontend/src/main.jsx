import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// ✅ Use your actual publishable key here (safe for frontend)
const pk =
  "pk_test_51Rvm7oCntqOlUsgSlqBMtqNRjAvJMlSK3SEOxTvjUMMCzhvgt76V3EW3JMcR2qP5vwA9xcgFKuOySzawUDnkmgnv00Oi5aqMiw";
const stripePromise = loadStripe(pk);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Elements
      stripe={stripePromise}
      options={{ appearance: { theme: "stripe" } }}
    >
      <App />
    </Elements>
  </StrictMode>
);
