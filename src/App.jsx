import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./index.css";
import NotFound from "./404";
import Home from "./Pages/Home";
import { AuthProvider } from "./stores/AuthContext";
import Blog from "./Pages/Blog";
import CreatePost from "./Pages/posts/CreatePost";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Testing from "./Pages/testing";
import Uploads from "./Pages/Uploads";

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Testing />} />
            {/* Admin Routes  */}
            <Route>
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
            </Route>
            {/* Post routes */}
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/post/create" element={<CreatePost />} />
            {/* Media Routes  */}
            <Route path="/uploads" element={<Uploads />} />
            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
