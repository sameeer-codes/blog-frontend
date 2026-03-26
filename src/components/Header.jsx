import { useContext, useState } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../stores/auth-context";
import ActionButton from "../ui/ActionButton";

const publicLinks = [
  {
    key: "Home",
    value: "/",
  },
  {
    key: "Blog",
    value: "/blog",
  },
];

const privateLinks = [
  {
    key: "My Posts",
    value: "/posts/me",
  },
  {
    key: "Create Post",
    value: "/post/create",
  },
  {
    key: "Uploads",
    value: "/uploads",
  },
];

export default function Header() {
  const {
    loggedIn: [isLoggedIn],
    authActions: { logout },
  } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = isLoggedIn
    ? [...publicLinks, ...privateLinks]
    : [...publicLinks];

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
            {links.map((link) => (
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
            classes="md:hidden !px-4 !py-2"
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
              <ActionButton to="/auth/login" variant="primary" classes="!px-5 !py-2">
                Login
              </ActionButton>
            </>
          )}

          {isLoggedIn && (
            <>
              <ActionButton to="/post/create" variant="primary" classes="!px-5 !py-2">
                New Draft
              </ActionButton>
              <ActionButton
                variant="ghost"
                classes="hidden md:inline-flex !px-4 !py-2"
                onClick={logout}
              >
                Logout
              </ActionButton>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.key}
                to={link.value}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium ${
                    isActive ? "bg-slate-900 text-white" : "bg-slate-50 text-primary"
                  }`
                }
              >
                {link.key}
              </NavLink>
            ))}

            {!isLoggedIn && (
              <>
                <ActionButton
                  to="/auth/register"
                  variant="secondary"
                  classes="rounded-2xl !px-4 !py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </ActionButton>
                <ActionButton
                  to="/auth/login"
                  variant="primary"
                  classes="rounded-2xl !px-4 !py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </ActionButton>
              </>
            )}

            {isLoggedIn && (
              <ActionButton
                variant="ghost"
                classes="justify-start rounded-2xl !px-4 !py-3 text-left"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </ActionButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
