import { Navigate, Outlet } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../stores/auth-context";

const GuestRoute = () => {
  const {
    loggedIn: [isLoggedIn],
    isReady,
  } = useContext(AuthContext);

  if (!isReady) {
    return null;
  }

  return <>{!isLoggedIn ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default GuestRoute;
