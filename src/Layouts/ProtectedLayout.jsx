import { useContext, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { AuthContext } from "../stores/auth-context";
import ActionButton from "../ui/ActionButton";
import { adminNavigationSections } from "../lib/navigation";

const ProtectedLayout = () => {
  const {
    authActions: { logout },
  } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeSectionLabel = useMemo(() => {
    for (const section of adminNavigationSections) {
      const match = section.links.find((link) => link.value === location.pathname);

      if (match) {
        return match.key;
      }
    }

    return "Workspace";
  }, [location.pathname]);

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#eef1f6] text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-[290px] border-r border-slate-200 bg-[#1f2937] text-white transition-transform lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Admin Console
              </p>
              <h1 className="mt-2 text-2xl tracking-tight">SCL Admin</h1>
            </div>
            <ActionButton
              variant="ghost"
              classes="lg:!hidden !border-white/20 !text-white"
              onClick={handleCloseSidebar}
            >
              Close
            </ActionButton>
          </div>

          <div className="space-y-8 px-4 py-5">
            {adminNavigationSections.map((section) => (
              <section key={section.title} className="space-y-3">
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.key}
                      to={link.value}
                      onClick={handleCloseSidebar}
                      className={({ isActive }) =>
                        `block rounded-xl px-3 py-2.5 transition-all ${
                          isActive
                            ? "bg-white text-slate-900"
                            : "text-slate-200 hover:bg-white/10"
                        }`
                      }
                    >
                      <span className="block text-sm font-semibold">{link.key}</span>
                    </NavLink>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <ActionButton
                  variant="secondary"
                  classes="lg:!hidden !rounded-2xl !px-4 !py-2"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  Menu
                </ActionButton>
                <div>
                  <h2 className="text-2xl tracking-tight">{activeSectionLabel}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ActionButton
                  to="/"
                  variant="ghost"
                  classes="!rounded-2xl !px-4 !py-2"
                >
                  View Site
                </ActionButton>
                <ActionButton
                  variant="dark"
                  classes="!rounded-2xl !px-4 !py-2"
                  onClick={logout}
                >
                  Logout
                </ActionButton>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="min-w-0">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
