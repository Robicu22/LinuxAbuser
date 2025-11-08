import React from "react";
import ReactDOM from "react-dom/client";
import PageExample from "./pages/PageExample";
import AboutPage from "./pages/About";
import Dashboard from "./pages/Dashboard";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/example",
    element: <PageExample />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
