import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LogInPage from "./logInpage/LogInPage";
import SignUpPage from "./signUppage/SignUpPage";
import TaskPageCreate from "./taskpagecreate/TaskPageCreate";
import TaskPageDisplay from "./taskpagedisplay/TaskPageDisplay";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/tasksCreate",
    element: <TaskPageCreate />,
  },
  {
    path: "/tasksDisplay",
    element: <TaskPageDisplay />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
