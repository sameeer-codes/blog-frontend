import { Link } from "react-router";
import { AuthContext } from "../stores/AuthContext";
import { useContext, useEffect } from "react";

export default function Header() {
  const {
    loggedIn: [isLoggedIn, setIsLoggedIn],
  } = useContext(AuthContext);
  
  return (
    <>
      <header className="flex items-center bg-gray-900 text-white">
        <div className="max-w-[1280px] mx-auto w-full px-4 py-2 flex justify-between items-center">
          <div className="text-2xl font-medium">
            <Link to="/">SCL</Link>
          </div>
          <div>
            <nav>
              <ul className="flex gap-4 text-sm text-gray-200">
                <Link to={"/"} className="hover:text-white">
                  Home
                </Link>
                <Link to={"/about"} className="hover:text-white">
                  About
                </Link>
                <Link to={"/contact"} className="hover:text-white">
                  Contact
                </Link>
                {!isLoggedIn && (
                  <>
                    <Link to={"/auth/login"} className="hover:text-white">
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
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
