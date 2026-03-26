import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AuthContext } from "../stores/auth-context";
import ActionButton from "../ui/ActionButton";
import { privateLinks, publicLinks } from "../lib/navigation";

export default function Header() {
  const {
    loggedIn: [isLoggedIn],
    authError,
    authActions: { logout },
  } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-primary text-3xl font-bold tracking-tight">
            SCL
          </Link>
          <p className="hidden text-sm text-secondary md:block">
            Sameer&apos;s Code Lab
          </p>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-2">
            {publicLinks.map((link) => (
              <li key={link.key}>
                <NavLink
                  to={link.value}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-primary hover:bg-slate-100"
                    }`
                  }
                >
                  {link.key}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ActionButton
            variant="ghost"
            classes="md:hidden !rounded-2xl !px-4 !py-2"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </ActionButton>

          {!isLoggedIn && (
            <>
              <ActionButton
                to="/auth/register"
                variant="secondary"
                classes="hidden md:inline-flex !px-4 !py-2"
              >
                Register
              </ActionButton>
              <ActionButton
                to="/auth/login"
                variant="primary"
                classes="hidden md:inline-flex !px-5 !py-2"
              >
                Login
              </ActionButton>
            </>
          )}

          {isLoggedIn && (
            <ActionButton
              variant="ghost"
              classes="hidden md:inline-flex !px-4 !py-2"
              onClick={logout}
            >
              Logout
            </ActionButton>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-30 bg-slate-950/35"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                  Navigation
                </p>
                <h2 className="mt-1 text-xl">Menu</h2>
              </div>
              <ActionButton
                variant="ghost"
                classes="!rounded-2xl !px-4 !py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Close
              </ActionButton>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                  Public
                </p>
                <div className="space-y-2">
                  {publicLinks.map((link) => (
                    <NavLink
                      key={link.key}
                      to={link.value}
                      className={({ isActive }) =>
                        `block rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-slate-50 text-primary"
                        }`
                      }
                    >
                      {link.key}
                    </NavLink>
                  ))}
                </div>
              </section>

              {isLoggedIn && (
                <section className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Admin
                  </p>
                  <div className="space-y-2">
                    {privateLinks.map((link) => (
                      <NavLink
                        key={link.key}
                        to={link.value}
                        className={({ isActive }) =>
                          `block rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                            isActive
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-primary"
                          }`
                        }
                      >
                        <span className="block">{link.key}</span>
                        <span
                          className={`mt-1 block text-xs leading-6 ${
                            location.pathname === link.value
                              ? "text-slate-200"
                              : "text-secondary"
                          }`}
                        >
                          {link.description}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="border-t border-slate-200 px-5 py-5">
              {!isLoggedIn && (
                <div className="grid gap-3">
                  <ActionButton to="/auth/login" variant="primary" classes="!rounded-2xl">
                    Login
                  </ActionButton>
                  <ActionButton to="/auth/register" variant="secondary" classes="!rounded-2xl">
                    Register
                  </ActionButton>
                </div>
              )}

              {isLoggedIn && (
                <div className="grid gap-3">
                  <ActionButton
                    to="/post/create"
                    variant="dark"
                    classes="!rounded-2xl"
                  >
                    New Draft
                  </ActionButton>
                  <ActionButton
                    variant="ghost"
                    classes="!rounded-2xl"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </ActionButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {authError && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <div className="mx-auto w-full max-w-[1280px]">{authError}</div>
        </div>
      )}
    </header>
  );
}
