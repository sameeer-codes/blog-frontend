import { Link } from "react-router";
import { AuthContext } from "../stores/AuthContext";
import { useContext, useEffect } from "react";

export default function Header() {
  const {
    loggedIn: [isLoggedIn, setIsLoggedIn],
  } = useContext(AuthContext);

  const links = [
    {
      key: "Home",
      value: "/",
    },
    {
      key: "About",
      value: "/about",
    },
    {
      key: "Services",
      value: "/services",
    },
    {
      key: "Contact",
      value: "/contact",
    },
  ];

  return (
    <>
      <header className="flex items-center bg-gray-100 absolute w-full top-0">
        <div className="max-w-[1280px] mx-auto w-full px-4 py-2 flex justify-between items-center">
          <div className="text-4xl font-medium font-bungee">
            <Link to="/">SCL</Link>
          </div>
          <div>
            <nav>
              <ul className="flex gap-4 text-primary font-bold font-primary">
                {links.map((link, index) => (
                  <Link
                    to={link.value}
                    key={index}
                    className="hover:text-accent-primary transition-colors"
                  >
                    {link.key}
                  </Link>
                ))}

                {/* {!isLoggedIn && (
                  <>
                    <Link to={"/auth/login"} className="">
                      Login
                    </Link>
                    <Link to={"/auth/register"} className="hover:text-white">
                      Sign up
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <Link to={"/post/create"} className="hover:text-white">
                      Create Post
                    </Link>
                  </>
                )} */}
              </ul>
            </nav>
          </div>
          <div className="">
            <Link
              to={"/contact"}
              className="bg-accent-primary hover:bg-accent-secondary px-4 py-2 rounded-md text-white font-primary font-bold"
            >
              Begin Journey
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
