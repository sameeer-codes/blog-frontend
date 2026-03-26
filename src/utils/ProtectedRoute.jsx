import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../stores/auth-context";

const ProtectedRoute = () => {
  const {
    loggedIn: [isLoggedIn],
    isReady,
  } = useContext(AuthContext);

  if (!isReady) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50 px-4">
        <div className="rounded-[28px] bg-white px-6 py-5 text-sm font-medium text-secondary shadow-soft">
          Preparing protected workspace...
        </div>
      </div>
    );
  }

  return <>{isLoggedIn ? <Outlet /> : <Navigate to={"/auth/login"} />}</>;
};

export default ProtectedRoute;
