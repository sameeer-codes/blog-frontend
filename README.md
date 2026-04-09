# Blog Frontend

This repository contains a Vite + React frontend for a blog application with two main experiences:

- A public reading side for browsing published posts
- A private admin workspace for authentication, post management, and uploads

The app is structured like a small production-style frontend. Routing, auth state, API access, reusable UI, and feature pages are separated into clear layers so the project stays readable as it grows.

## Stack

- React 19
- Vite 7
- React Router 7
- Axios
- React Hook Form
- Tailwind CSS 4

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Environment

The app currently uses the following environment variable:

```env
VITE_API_URL=http://localhost:3000/api
```

This value is used by the Axios client in `src/lib/api-client.js` to set the API base URL. If it is missing, the client falls back to `http://localhost:8000/api/`.

## Route Guide

The route map is defined in `src/App.jsx`.

### Public Routes

| Route | Access | Purpose | Notes |
| --- | --- | --- | --- |
| `/` | Public | Home landing page | Introduces the project, architecture themes, and links into the app |
| `/about` | Public | About page | Explains the practice-project goals, architecture focus, and build process |
| `/blog` | Public | Published posts index | Lists public posts with pagination and inline search input |
| `/blog/search` | Public | Search-focused blog index | Uses the same `PostsIndex` page as `/blog`, but the UI reads as a search results view |
| `/blog/:slug` | Public | Single blog article | Fetches a published post by slug and shows related reading |
| `*` | Public | Not found page | Catch-all route for unmatched URLs |

### Guest-Only Routes

These routes are wrapped by `src/utils/GuestRoute.jsx`.

- If the user is not logged in, the route renders normally
- If the user is already logged in, they are redirected to `/`
- While auth bootstrapping is still running, the route waits for `isReady`

| Route | Access | Purpose | Notes |
| --- | --- | --- | --- |
| `/auth/register` | Guest only | Register a new admin account | Validates username, email, and password, then redirects to login on success |
| `/auth/login` | Guest only | Log in to the admin workspace | Submits credentials through the auth context and redirects to `/posts/me` |

### Admin Routes

These routes render inside `src/Layouts/ProtectedLayout.jsx`.

Current note:

- The admin area is temporarily left open for testing and is not currently wrapped by `ProtectedRoute`
- The underlying admin API still expects an approved admin session with both bearer token and refresh cookie

| Route | Access | Purpose | Notes |
| --- | --- | --- | --- |
| `/admin` | Testing-open admin shell | Admin landing page | Entry point into the admin workspace |
| `/admin/users` | Testing-open admin shell | Admin users table | Lists users from `GET /api/admin/users` with status and role controls |
| `/admin/users/:userId` | Testing-open admin shell | Single user detail | Fetches one user plus that user's posts and uploads from `GET /api/admin/users/single` |
| `/admin/posts` | Testing-open admin shell | Admin posts table | Lists posts from `GET /api/admin/posts`, supports status changes and delete |
| `/admin/posts/:postId/edit` | Testing-open admin shell | Admin post editor | Updates post content through `PATCH /api/admin/posts` |
| `/admin/uploads` | Testing-open admin shell | Admin uploads table | Lists uploads from `GET /api/admin/uploads`, supports metadata edits and delete |

### Protected Routes

These routes are wrapped by `src/utils/ProtectedRoute.jsx` and `src/Layouts/ProtectedLayout.jsx`.

- If the user is not logged in, they are redirected to `/auth/login`
- If auth is still being restored, a loading screen is shown
- Protected pages render inside the shared admin-style layout

| Route | Access | Purpose | Notes |
| --- | --- | --- | --- |
| `/post/create` | Authenticated users only | Create a new post | Uses the shared `PostForm` component and defaults new posts to `draft` |
| `/post/edit/:postId` | Authenticated users only | Edit an existing owned post | Loads a post by numeric id and updates title, content, excerpt, image, and status |
| `/posts/me` | Authenticated users only | Admin post dashboard | Lists the current user's posts with status filters and pagination |
| `/uploads` | Authenticated users only | Uploads manager | Handles file uploads, metadata editing, previewing, and deletion |

## How The App Is Organized

The project uses a feature-oriented structure inside `src/`:

| Path | Responsibility |
| --- | --- |
| `src/main.jsx` | App bootstrap and React root mounting |
| `src/App.jsx` | Global route composition and route protection |
| `src/Pages/` | Route-level screens for public, auth, and post workflows |
| `src/Pages/admin/` | Admin route screens for moderation, detail drill-down, and editing |
| `src/Layouts/` | Shared page layouts, especially for protected admin routes |
| `src/components/` | Reusable page sections and larger UI building blocks |
| `src/ui/` | Smaller presentational primitives such as buttons and inputs |
| `src/stores/` | Auth context and shared state wiring |
| `src/services/` | API-facing modules grouped by domain such as auth, posts, uploads, and admin |
| `src/lib/` | Shared helpers for API setup, navigation data, and response normalization |
| `src/hooks/` | Custom React hooks |
| `src/utils/` | Route guards and small utility components |
| `src/index.css` | Global styling entry point |

## Authentication Flow

- Auth state is managed in `src/stores/AuthContext.jsx`
- JWT tokens are stored in `localStorage` under `authToken`
- The Axios client injects the token into requests automatically
- On `401` responses, the client attempts token refresh before failing
- If refresh fails, the session is cleared and protected routes require login again

## Feature Notes

- Public posts are fetched through the posts service and rendered in `PostsIndex` and `Blog`
- Post creation and editing share the `PostForm` component
- Upload management includes client-side file validation, metadata updates, and deletion
- The admin area now has endpoint-backed tables for users, posts, and uploads
- Admin users supports `GET /api/admin/users`, `GET /api/admin/users/single`, `PATCH /api/admin/users/status`, and `PATCH /api/admin/users/role`
- Admin posts supports `GET /api/admin/posts`, `PATCH /api/admin/posts/status`, `PATCH /api/admin/posts`, and `DELETE /api/admin/posts`
- Admin uploads supports `GET /api/admin/uploads`, `PATCH /api/admin/uploads`, and `DELETE /api/admin/uploads`
- The app includes an `ErrorBoundary` at the top level to prevent full-app crashes on rendering errors

## Admin API Mapping

The admin frontend service layer lives in `src/services/admin.js`.

Currently mapped endpoints:

- `GET /api/admin/users`
- `GET /api/admin/users/single`
- `PATCH /api/admin/users/status`
- `PATCH /api/admin/users/role`
- `GET /api/admin/posts`
- `PATCH /api/admin/posts/status`
- `PATCH /api/admin/posts`
- `DELETE /api/admin/posts`
- `GET /api/admin/uploads`
- `PATCH /api/admin/uploads`
- `DELETE /api/admin/uploads`
