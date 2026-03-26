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
        <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden self-start lg:block">
            <div className="sticky top-28 space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Admin Workspace
                </p>
                <h2 className="text-2xl leading-tight">Private navigation</h2>
                <p className="text-sm leading-7 text-secondary">
                  Protected tools for posts, media, and editing workflows.
                </p>
              </div>

              <nav className="space-y-2">
                {privateLinks.map((link) => (
                  <NavLink
                    key={link.key}
                    to={link.value}
                    className={({ isActive }) =>
                      `block rounded-3xl border px-4 py-4 transition-all ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 text-primary hover:border-slate-300 hover:bg-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="block text-sm font-semibold">{link.key}</span>
                        <span
                          className={`mt-1 block text-xs leading-6 ${
                            isActive ? "text-slate-200" : "text-secondary"
                          }`}
                        >
                          {link.description}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm leading-7 text-secondary">
                  This workspace is only available inside an authenticated admin session.
                </p>
              </div>

              <ActionButton variant="ghost" classes="w-full !rounded-3xl" onClick={logout}>
                Logout
              </ActionButton>
            </div>
          </aside>

          <div className="min-w-0">
            <section className="mb-8 rounded-[32px] border border-slate-200 bg-white px-6 py-7 shadow-soft">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                    Admin Workspace
                  </p>
                  <h1 className="text-3xl">Private admin dashboard</h1>
                  <p className="max-w-3xl text-sm leading-7 text-secondary">
                    Manage posts, uploads, and account-only content from this private workspace.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-secondary">
                  Admin session required.
                </div>
              </div>
            </section>

            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProtectedLayout;
