import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LogInPage from "./Pages/logInpage/LogInPage";
import SignUpPage from "./Pages/signUppage/SignUpPage";
import TaskPageCreate from "./Pages/taskpagecreate/TaskPageCreate";
import TaskPageDisplay from "./Pages/taskpagedisplay/TaskPageDisplay";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AboutPage from "./Pages/About/AboutPage";
import { WorkspacePage, WorkspaceAdminPage } from "./Pages/Workspace";
import WorkspaceDetailPage from "./Pages/Workspace/WorkspaceDetailPage";
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
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/workspaces",
    element: <WorkspacePage />,
  },
  {
    path: "/workspace-admin",
    element: <WorkspaceAdminPage />,
  },
  {
    path: "/workspace/:id",
    element: <WorkspaceDetailPage />,
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
