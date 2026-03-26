# Frontend Review

## Overview

This project is a React + Vite frontend for a blog application with two clear surfaces:

- a public reading experience for visitors
- a private admin workspace for the single site owner

The codebase is useful as a practice project because it covers routing, authentication, authorization, API integration, upload handling, reusable forms, modal interactions, and shared UI primitives.

## Current Code Structure

### App Shell

- `src/App.jsx`
  Registers the full route tree and wraps the application with `ErrorBoundary`, `AuthProvider`, and `Router`.

- `src/404.jsx`
  Handles unknown routes.

- `src/index.css`
  Holds the global tokens, font imports, and base utility styles.

### Public Pages

- `src/Pages/Home.jsx`
  Practice-project landing page.

- `src/Pages/About.jsx`
  Explains the project, methods, and learning goals.

- `src/Pages/posts/PostsIndex.jsx`
  Public blog listing with search.

- `src/Pages/Blog.jsx`
  Public single-post detail page.

### Auth Pages

- `src/Pages/auth/Login.jsx`
  Admin login form.

- `src/Pages/auth/Register.jsx`
  Admin registration form.

### Protected Pages

- `src/Pages/posts/MyPosts.jsx`
  Admin overview of posts with status filters.

- `src/Pages/posts/CreatePost.jsx`
  Create-post screen.

- `src/Pages/posts/EditPost.jsx`
  Edit-post screen.

- `src/Pages/Uploads.jsx`
  Upload library, metadata editing, and preview modal.

### Shared Components

- `src/components/Header.jsx`
  Shared top header with desktop nav and mobile off-canvas navigation.

- `src/components/Footer.jsx`
  Shared footer.

- `src/components/AuthShell.jsx`
  Shared auth layout wrapper.

- `src/components/ErrorBoundary.jsx`
  Runtime fallback for rendering failures.

- `src/components/PostForm.jsx`
  Reusable editor shared by create and edit post flows.

### Layouts

- `src/Layouts/ProtectedLayout.jsx`
  Shared protected shell with sidebar navigation for admin routes.

### State and Context

- `src/stores/AuthContext.jsx`
  Holds token state, login/logout actions, refresh flow, and session bootstrap logic.

- `src/stores/auth-context.js`
  Exports the React context object used by the provider and consumers.

### API Layer

- `src/lib/api-client.js`
  Central Axios instance, auth header injection, and refresh-token retry flow.

- `src/lib/api-helpers.js`
  Response shaping helpers and error-message helpers.

- `src/lib/navigation.js`
  Shared public and protected route definitions used by the header and protected sidebar.

- `src/services/auth.js`
  Auth-related API calls.

- `src/services/posts.js`
  Public and protected post API calls.

- `src/services/uploads.js`
  Upload API calls.

### Hooks and Utilities

- `src/hooks/useUploadsLibrary.js`
  Shared uploads-fetching hook for image selection flows.

- `src/utils/ProtectedRoute.jsx`
  Blocks unauthenticated users from private routes.

- `src/utils/GuestRoute.jsx`
  Redirects authenticated users away from login and register pages.

### UI Primitives

- `src/ui/ActionButton.jsx`
  Shared button primitive that can render as a button, router link, or label.

- `src/ui/Input.jsx`
  Shared input wrapper for forms.

## Current Application Flow

### Public Flow

1. The visitor opens `Home`.
2. The visitor can open `About` to understand the project.
3. The visitor can open `PostsIndex` at `/blog`.
4. Search queries update the public post listing.
5. A selected post opens at `/blog/:slug`.

### Private Flow

1. The admin logs in through `Login`.
2. The backend returns a JWT and sets a refresh-token cookie.
3. `AuthContext` stores the JWT and marks the session as active.
4. `ProtectedRoute` allows protected screens to render.
5. `ProtectedLayout` renders the admin shell and sidebar.
6. The admin can manage posts and uploads through the protected pages.

## Authentication and Authorization

### Authentication

The app uses a two-part session strategy:

- access token in localStorage
- refresh-token cookie managed by the backend

### Session Flow

1. `loginUser()` sends credentials.
2. The backend returns a JWT.
3. `AuthContext` stores the JWT in state and localStorage.
4. `configureApiClient()` injects the token into outgoing requests.
5. If a request returns `401`, the Axios interceptor calls `refreshSessionToken()`.
6. If refresh succeeds, the request is retried with the new token.
7. If refresh fails, the frontend clears the session.

### Authorization

Authorization in this project is route-based:

- `GuestRoute` protects guest-only pages
- `ProtectedRoute` protects admin-only pages
- `ProtectedLayout` groups the admin navigation and shell

This is not role-based authorization yet. It is a clean public-versus-admin split.

## Methods and Techniques Used

### React Patterns

- functional components
- hooks-based state management
- Context API for shared auth state
- `useEffect` for request and session lifecycle work
- `useMemo` for derived state
- `useCallback` for stable function references
- component composition for forms and layouts

### Routing Patterns

- public routes
- guest-only routes
- protected routes
- nested route layout for admin pages
- dynamic route params like `:slug` and `:postId`

### API Patterns

- Axios instance abstraction
- request and response interceptors
- service-layer separation from UI
- normalized API response handling
- retry logic after token refresh

### Form Patterns

- `react-hook-form`
- inline validation rules
- reusable post form component
- hidden field handling for featured-image upload ids

### UI Patterns

- reusable button primitive
- modal-based upload preview and metadata editing
- modal-based featured-image picker
- responsive grid layouts
- mobile off-canvas navigation

## Scaling Notes

- `AuthContext` is still token-focused and does not yet hold a full user profile object.
- `MyPosts` filters only the currently fetched page of results, not the full dataset.
- Dedicated hooks for post fetching could reduce duplication as the app grows.
- Type-safe schemas would help if the API grows more complex.
- Test coverage should eventually be added for auth refresh, payload mapping, and upload workflows.

## Interview Topics This Project Covers

- React component architecture
- React Router route protection
- Context API
- JWT authentication
- refresh-token session recovery
- Axios interceptors
- form handling with `react-hook-form`
- reusable component patterns
- grid and modal UI flows
- backend payload normalization
- state and side-effect management

## Syntax and Interview Questions

### React and JSX Syntax

1. What is the difference between `useState` and `useMemo`?
2. What does `useEffect(() => {}, [])` mean?
3. Why would you use `useCallback` around an auth action?
4. What is the purpose of a dependency array in `useEffect`?
5. What happens if you leave a value out of a dependency array?
6. What is the difference between `children` and props like `title`?
7. What does this JSX pattern mean: `{isLoggedIn && <Panel />}`?
8. What is the difference between `{condition ? <A /> : <B />}` and `{condition && <A />}`?
9. Why do list items need a `key` prop in React?
10. What problem does optional chaining like `post?.post_title` solve?
11. What is the difference between `className` and `class` in React?
12. Why is `htmlFor` used on labels instead of `for`?

### React Hooks and State Questions

13. Why is `useEffect` commonly used for data fetching?
14. What is a derived value, and why can `useMemo` help with it?
15. What kind of value belongs in React state, and what kind should be derived instead?
16. What is the difference between local component state and context state?
17. Why is auth stored in context in this project?
18. What is a stale closure in React?
19. Why can asynchronous code inside a component cause state-sync issues?
20. Why is cleanup logic useful inside `useEffect`?

### JavaScript Syntax and Language Questions

21. What is the difference between `const`, `let`, and `var`?
22. What is the difference between `==` and `===`?
23. What is the difference between `null`, `undefined`, and `""`?
24. Why is `Number(values.featuredImage)` used before sending the payload?
25. What does array spreading like `[...publicLinks, ...privateLinks]` do?
26. What does object spreading like `{ ...post, featured_image: id }` do?
27. What is the difference between `map`, `filter`, and `find`?
28. Why is `async/await` used instead of nested `.then()` chains in many parts of the app?
29. What does `try/catch/finally` do?
30. What is the difference between a function declaration and an arrow function?

### Routing and Authorization Questions

31. Why are `ProtectedRoute` and `GuestRoute` separate components?
32. What is the benefit of nested routing with `ProtectedLayout`?
33. What is the difference between a route param and a query param?
34. Why is `/blog/:slug` a dynamic route?
35. Why is route protection a form of authorization rather than authentication?
36. Why is the protected sidebar defined separately from the public header navigation?

### Axios and API Questions

37. What is an Axios instance, and why is it useful?
38. What is the purpose of an Axios request interceptor?
39. What is the purpose of an Axios response interceptor?
40. Why does the client retry a request after refreshing the token?
41. Why is the refresh flow centralized in `api-client.js` instead of each page?
42. What is the difference between sending data in query params and JSON body params?
43. Why do uploads use `multipart/form-data`?
44. Why is a service-layer file like `posts.js` useful?

### Form and Validation Questions

45. Why does this project use `react-hook-form` instead of `useState` for every input?
46. What is the difference between controlled and uncontrolled form inputs?
47. Why is frontend validation still useful even when the backend also validates?
48. Why is a hidden field used for `featuredImage` in the post form?
49. What problem does reusable validation logic solve in a larger codebase?
50. Why should payload field names match backend naming exactly?

### UI and Architecture Questions

51. Why was the uploads page built as a grid instead of a plain list?
52. Why was `object-contain` used for image previews?
53. Why is a modal useful for upload metadata editing?
54. Why is `PostForm` shared by both create and edit pages?
55. Why is `ErrorBoundary` useful in a React app?
56. Why should frontend UI copy avoid exposing backend endpoint details?
57. Why is a shared navigation file useful after adding both a header menu and a sidebar?
58. Why can client-side filtering on a paginated page become misleading?
59. Why is debounced search better than firing a request on every keystroke?
60. Why is it useful to separate public pages from protected admin pages in the route tree?

## Short Review Prompts

- Explain the login flow from form submit to protected-route access.
- Explain the refresh-token retry flow.
- Explain how the featured-image picker converts a visual selection into an integer payload.
- Explain why the admin routes now use a protected sidebar and the mobile layout uses an off-canvas panel.
- Explain one scaling limitation in the current project and how you would improve it.

## Practical Summary

This project is strong interview practice because it demonstrates:

- route structure and navigation layering
- auth and session recovery
- real API wiring
- upload management
- form reuse
- payload mapping
- modal and grid UI work
- incremental refactoring toward maintainability

The strongest areas to discuss in an interview are:

- auth/session architecture
- component reuse
- API abstraction
- route protection
- payload normalization
- frontend scaling tradeoffs
