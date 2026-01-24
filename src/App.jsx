import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./index.css";
import NotFound from "./404";
import Home from "./Pages/Home";
import { AuthContext, AuthProvider } from "./stores/AuthContext";
import Blog from "./Pages/Blog";
import CreatePost from "./Pages/posts/CreatePost";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Testing from "./Pages/testing";
import Uploads from "./Pages/Uploads";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import { useContext, useEffect } from "react";
import SimpleLayout from "./Layouts/SimpleLayout";
import GuestRoute from "./utils/GuestRoute";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route element={<SimpleLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/test" element={<Testing />} />
            </Route>
            {/* Admin Routes  */}
            <Route element={<GuestRoute />}>
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
            </Route>
            {/* Post routes */}
            <Route path="/blog/:slug" element={<Blog />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/post/create" element={<CreatePost />} />
              {/* Media Routes  */}
              <Route path="/uploads" element={<Uploads />} />
            </Route>
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
