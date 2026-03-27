import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import Pricing from "../pages/Pricing";
import PrivateRoute from "../components/PrivateRoute";
import Quiz from "../pages/Quiz";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/quiz",
    element: (
      <PrivateRoute>
        <Quiz />
      </PrivateRoute>
    ),
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
]);

export default router;
