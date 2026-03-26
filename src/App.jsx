import { BrowserRouter as Router, Route, Routes } from "react-router";
import "./index.css";
import NotFound from "./404";
import Home from "./Pages/Home";
import { AuthProvider } from "./stores/AuthContext";
import Blog from "./Pages/Blog";
import About from "./Pages/About";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import Uploads from "./Pages/Uploads";
import GuestRoute from "./utils/GuestRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import ProtectedLayout from "./Layouts/ProtectedLayout";
import CreatePost from "./Pages/posts/CreatePost";
import EditPost from "./Pages/posts/EditPost";
import MyPosts from "./Pages/posts/MyPosts";
import PostsIndex from "./Pages/posts/PostsIndex";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<PostsIndex />} />
            <Route path="/blog/search" element={<PostsIndex />} />
            <Route path="/blog/:slug" element={<Blog />} />

            <Route element={<GuestRoute />}>
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/post/create" element={<CreatePost />} />
                <Route path="/post/edit/:postId" element={<EditPost />} />
                <Route path="/posts/me" element={<MyPosts />} />
                <Route path="/uploads" element={<Uploads />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
