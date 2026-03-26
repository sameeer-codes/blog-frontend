import Header from "../components/Header";
import { NavLink, Outlet } from "react-router";
import Footer from "../components/Footer";
import { privateLinks } from "../lib/navigation";
import { useContext } from "react";
import { AuthContext } from "../stores/auth-context";
import ActionButton from "../ui/ActionButton";

const ProtectedLayout = () => {
  const {
    authActions: { logout },
  } = useContext(AuthContext);

  return (
    <>
      <Header />
      <main className="border-b border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-8">
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProtectedLayout;
