import Header from "../components/Header";
import { Outlet } from "react-router";
import Footer from "../components/Footer";

const ProtectedLayout = () => {
  return (
    <>
      <Header />
      <section className="border-b border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Admin Workspace
            </p>
            <h1 className="text-3xl">Private admin dashboard</h1>
            <p className="max-w-3xl text-sm leading-7 text-secondary">
              This area is intentionally frontend-first for now. It lets the site admin move
              through post and upload management pages with local auth state before API integration.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-secondary shadow-soft">
            Demo session active. Route protection and page structure are ready for backend wiring.
          </div>
        </div>
      </section>
      <Outlet />
      <Footer />
    </>
  );
};

export default ProtectedLayout;
