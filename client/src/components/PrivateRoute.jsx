import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;