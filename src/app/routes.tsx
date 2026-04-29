import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Teams from "./pages/Teams";
import Replies from "./pages/Replies";
import ProfileSettings from "./pages/ProfileSettings";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/sessions", element: <Sessions /> },
  { path: "/teams", element: <Teams /> },
  { path: "/replies", element: <Replies /> },
  { path: "/settings", element: <ProfileSettings /> },
], { basename: '/Verbumlocalsupervisorv12-main/' });
