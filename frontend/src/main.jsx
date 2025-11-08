import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import LogInPage from "./Pages/logInpage/LogInPage";
import SignUpPage from "./Pages/signUppage/SignUpPage";
import TaskPageCreate from "./Pages/taskpagecreate/TaskPageCreate";
import TaskPageDisplay from "./Pages/taskpagedisplay/TaskPageDisplay";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AboutPage from "./Pages/About/AboutPage";
import WorkspacePage from "./Pages/Workspace/WorkspacePage";
import WorkspaceAdminPage from "./Pages/Workspace/WorkspaceAdminPage";
import WorkspaceDetailPage from "./Pages/Workspace/WorkspaceDetailPage";
import InboxPage from "./Pages/Inbox/InboxPage";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",  
    element: <LogInPage />,
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
    path: "/inbox",
    element: <InboxPage />,
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
    path: "/workspaces/:id",
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
  
    <RouterProvider router={router} />
  
);

