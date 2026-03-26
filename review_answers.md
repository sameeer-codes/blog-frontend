# Frontend Review Answers

This file is the expanded answer key for the questions in `review.md`.

How to use it:
- Read the short explanation first.
- Study the code example.
- Practice explaining the "tip" section in your own words.
- Relate the answer back to this codebase wherever possible.

## React and JSX Syntax

### 1. What is the difference between `useState` and `useMemo`?

`useState` stores a value that can change over time and cause a re-render. `useMemo` does not store user-editable state; it memoizes a computed value so React does not recompute it unless dependencies change.

```jsx
const [count, setCount] = useState(0);

const doubled = useMemo(() => {
  return count * 2;
}, [count]);
```

Use case:
- `useState`: form inputs, modal open/close state, fetched data
- `useMemo`: filtered arrays, expensive calculations, derived labels

Tip:
If a value can be calculated from existing state, first ask whether it should be derived with `useMemo` instead of stored separately.

### 2. What does `useEffect(() => {}, [])` mean?

It means "run this effect once after the component mounts."

```jsx
useEffect(() => {
  console.log("Component mounted");
}, []);
```

In this project, effects like this are useful for:
- bootstrapping auth/session state
- attaching temporary event listeners
- fetching initial page data

Tip:
An empty dependency array does not mean "safe for everything." It means the effect will not react to later state changes.

### 3. Why would you use `useCallback` around an auth action?

`useCallback` memoizes a function reference. This is useful when:
- the function is passed to children
- the function is used inside effects
- you want stable references in context values

```jsx
const logout = useCallback(async () => {
  await logoutUser();
  clearSession();
}, [clearSession]);
```

Why it matters:
If `logout` gets recreated every render, dependent effects or memoized children may rerun unnecessarily.

Tip:
Use `useCallback` for reference stability, not for random optimization.

### 4. What is the purpose of a dependency array in `useEffect`?

The dependency array tells React when the effect should rerun.

```jsx
useEffect(() => {
  fetchPost(postId);
}, [postId]);
```

Meaning:
- no array: run after every render
- empty array: run once after mount
- values in array: rerun when any dependency changes

Tip:
The dependency array should describe what the effect uses from the outer scope.

### 5. What happens if you leave a value out of a dependency array?

You can get stale values and incorrect behavior.

```jsx
useEffect(() => {
  console.log(token);
}, []); // wrong if token can change
```

Problem:
- the effect captures the old `token`
- later updates to `token` will not rerun the effect

Tip:
If ESLint warns about missing dependencies, do not ignore it unless you fully understand why.

### 6. What is the difference between `children` and props like `title`?

`children` is whatever is nested inside a component. Other props are named values passed directly.

```jsx
function Card({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

<Card title="Posts">
  <p>Body content here</p>
</Card>
```

Tip:
Use `children` when you want flexible nested UI composition.

### 7. What does `{isLoggedIn && <Panel />}` mean?

This is conditional rendering using short-circuit logic.

```jsx
{isLoggedIn && <AdminPanel />}
```

Meaning:
- if `isLoggedIn` is truthy, render `<AdminPanel />`
- if it is falsy, render nothing

Tip:
This is cleaner than a full ternary when you only need one branch.

### 8. What is the difference between `{condition ? <A /> : <B />}` and `{condition && <A />}`?

A ternary renders one of two options. `&&` renders only one option or nothing.

```jsx
{isLoggedIn ? <LogoutButton /> : <LoginButton />}

{isLoggedIn && <LogoutButton />}
```

Use ternary when:
- both states need UI

Use `&&` when:
- only the truthy branch matters

### 9. Why do list items need a `key` prop in React?

Keys help React identify which list item is which between renders.

```jsx
{posts.map((post) => (
  <PostCard key={post.id} post={post} />
))}
```

Why it matters:
- better reconciliation
- fewer UI bugs
- correct item preservation on reorder/update

Bad example:

```jsx
{posts.map((post, index) => (
  <PostCard key={index} post={post} />
))}
```

Tip:
Prefer stable database IDs over array indexes.

### 10. What problem does optional chaining like `post?.post_title` solve?

It prevents runtime errors when the left side might be `null` or `undefined`.

```jsx
const title = post?.post_title;
```

Without optional chaining:

```jsx
const title = post.post_title; // crashes if post is null
```

Tip:
Optional chaining is useful for async-loaded data, but do not use it to hide broken state everywhere.

### 11. What is the difference between `className` and `class` in React?

In JSX, `className` is used instead of HTML `class`.

```jsx
<div className="rounded-2xl bg-white p-4" />
```

Why:
- `class` conflicts with JavaScript syntax conventions
- React uses `className` as the prop name

### 12. Why is `htmlFor` used on labels instead of `for`?

In JSX, label associations use `htmlFor`.

```jsx
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

Why:
- `for` is a JavaScript keyword
- React uses `htmlFor` to mirror the HTML attribute

Tip:
This improves accessibility because the label clicks focus the input.

## React Hooks and State Questions

### 13. Why is `useEffect` commonly used for data fetching?

Fetching data is a side effect. Effects run after render, which is the right time to start requests.

```jsx
useEffect(() => {
  async function loadPosts() {
    const data = await getPosts();
    setPosts(data);
  }

  loadPosts();
}, []);
```

Tip:
Avoid making the effect callback itself `async`; define an inner async function instead.

### 14. What is a derived value, and why can `useMemo` help with it?

A derived value is computed from existing data rather than stored separately.

```jsx
const publishedPosts = useMemo(() => {
  return posts.filter((post) => post.post_status === "published");
}, [posts]);
```

Why `useMemo` helps:
- avoids repeated recalculation
- keeps render logic cleaner

Tip:
Do not memoize everything. Use it where a value is reused or costly to compute.

### 15. What kind of value belongs in React state, and what kind should be derived instead?

State should hold source-of-truth values:
- fetched data
- form input values
- modal open/close state
- pagination values

Derived values should usually be computed:
- filtered arrays
- totals
- labels based on status

```jsx
const [posts, setPosts] = useState([]);
const [activeFilter, setActiveFilter] = useState("all");

const visiblePosts = useMemo(() => {
  if (activeFilter === "all") return posts;
  return posts.filter((post) => post.post_status === activeFilter);
}, [posts, activeFilter]);
```

Tip:
Duplicating derived data in state often creates sync bugs.

### 16. What is the difference between local component state and context state?

Local state belongs to one component.

```jsx
const [isModalOpen, setIsModalOpen] = useState(false);
```

Context state is shared across many components.

```jsx
<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
```

In this project:
- local state: modal toggles, selected upload, current filter
- context state: login status, token, auth actions

### 17. Why is auth stored in context in this project?

Because many separate parts of the app need it:
- header
- route guards
- protected pages
- API client configuration

```jsx
const { loggedIn, authActions } = useContext(AuthContext);
```

Tip:
Context is good for app-wide concerns like theme, auth, or shared settings.

### 18. What is a stale closure in React?

A stale closure happens when a function captures old values and keeps using them later.

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // may log old count if effect dependencies are wrong
  }, 1000);

  return () => clearInterval(id);
}, []);
```

Tip:
If logic depends on changing values, check your dependencies carefully.

### 19. Why can asynchronous code inside a component cause state-sync issues?

Because responses may arrive after:
- the component unmounts
- the user changes page
- a newer request already finished

```jsx
useEffect(() => {
  let isMounted = true;

  async function loadData() {
    const result = await getPosts();
    if (isMounted) {
      setPosts(result);
    }
  }

  loadData();

  return () => {
    isMounted = false;
  };
}, []);
```

Tip:
Always consider timing in async UI code.

### 20. Why is cleanup logic useful inside `useEffect`?

Cleanup runs when:
- the component unmounts
- dependencies change before rerunning the effect

Examples:
- remove listeners
- clear timers
- cancel subscriptions

```jsx
useEffect(() => {
  function handleResize() {
    console.log(window.innerWidth);
  }

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

## JavaScript Syntax and Language Questions

### 21. What is the difference between `const`, `let`, and `var`?

`const`:
- cannot be reassigned
- block scoped

`let`:
- can be reassigned
- block scoped

`var`:
- function scoped
- older behavior
- easier to misuse

```js
const apiBase = "/api";
let page = 1;
var oldStyle = "avoid-this";
```

Tip:
Use `const` by default. Use `let` only when reassignment is needed.

### 22. What is the difference between `==` and `===`?

`===` checks value and type.
`==` allows type coercion.

```js
5 === "5"; // false
5 == "5";  // true
```

Tip:
In modern frontend code, prefer `===` and `!==`.

### 23. What is the difference between `null`, `undefined`, and `""`?

`null`:
- intentional empty value

`undefined`:
- no value assigned yet

`""`:
- empty string

```js
const featuredImage = null;
let token;
const excerpt = "";
```

In APIs, these differences matter:
- `null` may mean "clear this field"
- `undefined` may mean "leave unchanged"
- `""` may mean "field provided, but empty"

### 24. Why is `Number(values.featuredImage)` used before sending the payload?

Form values often come through as strings. The backend expects an integer.

```js
const payload = {
  featured_image: Number(values.featuredImage),
};
```

Without conversion:

```js
featured_image: "12"; // string
```

Tip:
Always match backend types, not just names.

### 25. What does array spreading like `[...publicLinks, ...privateLinks]` do?

It creates a new array by copying items from multiple arrays.

```js
const links = [...publicLinks, ...privateLinks];
```

Why useful:
- non-mutating
- readable
- common in React state and data composition

### 26. What does object spreading like `{ ...post, featured_image: id }` do?

It copies an object, then overrides or adds properties.

```js
const updatedPost = {
  ...post,
  featured_image: selectedUploadId,
};
```

Tip:
This is heavily used in immutable state updates.

### 27. What is the difference between `map`, `filter`, and `find`?

`map` transforms every item:

```js
const titles = posts.map((post) => post.post_title);
```

`filter` keeps matching items:

```js
const drafts = posts.filter((post) => post.post_status === "draft");
```

`find` returns the first match:

```js
const selected = uploads.find((upload) => upload.id === selectedId);
```

Tip:
If you only need one item, use `find`, not `filter`.

### 28. Why is `async/await` used instead of nested `.then()` chains in many parts of the app?

Because it reads more like synchronous logic.

```js
async function loadPosts() {
  try {
    const response = await getPosts();
    setPosts(response.data);
  } catch (error) {
    setError("Failed to load posts");
  }
}
```

Compared to:

```js
getPosts()
  .then((response) => setPosts(response.data))
  .catch(() => setError("Failed to load posts"));
```

Tip:
`async/await` is usually easier to debug and easier to combine with `try/catch`.

### 29. What does `try/catch/finally` do?

`try` runs the code.
`catch` handles errors.
`finally` always runs afterward.

```js
try {
  const result = await savePost(payload);
  setSuccess(result.message);
} catch (error) {
  setError("Save failed");
} finally {
  setSubmitting(false);
}
```

Tip:
Use `finally` for cleanup-like UI state such as loading flags.

### 30. What is the difference between a function declaration and an arrow function?

Function declaration:

```js
function formatDate(value) {
  return new Date(value).toLocaleDateString();
}
```

Arrow function:

```js
const formatDate = (value) => {
  return new Date(value).toLocaleDateString();
};
```

Differences:
- declarations are hoisted
- arrow functions use lexical `this`

Tip:
In React, arrow functions are very common for handlers and callbacks.

## Routing and Authorization Questions

### 31. Why are `ProtectedRoute` and `GuestRoute` separate components?

Because they solve opposite access rules.

`ProtectedRoute`:
- allows only logged-in users

`GuestRoute`:
- allows only logged-out users

```jsx
<Route element={<GuestRoute />}>
  <Route path="/auth/login" element={<Login />} />
</Route>

<Route element={<ProtectedRoute />}>
  <Route path="/uploads" element={<Uploads />} />
</Route>
```

Tip:
Separate guards are easier to reason about than one giant conditional wrapper.

### 32. What is the benefit of nested routing with `ProtectedLayout`?

Nested layouts let multiple routes share one outer shell.

```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<ProtectedLayout />}>
    <Route path="/posts/me" element={<MyPosts />} />
    <Route path="/uploads" element={<Uploads />} />
  </Route>
</Route>
```

Benefits:
- less duplication
- consistent layout
- shared header/footer/banner/sidebar behavior

### 33. What is the difference between a route param and a query param?

Route param:

```txt
/blog/:slug
```

Query param:

```txt
/blog?page=2&search=react
```

In code:

```jsx
const { slug } = useParams();
const [searchParams] = useSearchParams();
const page = searchParams.get("page");
```

### 34. Why is `/blog/:slug` a dynamic route?

Because the `slug` part changes depending on the selected article.

```jsx
<Route path="/blog/:slug" element={<Blog />} />
```

Examples:
- `/blog/react-hooks-guide`
- `/blog/my-first-post`

Tip:
Dynamic routes are useful for resource-specific pages.

### 35. Why is route protection a form of authorization rather than authentication?

Authentication asks:
- who is the user?

Authorization asks:
- what is the user allowed to access?

Example:
- login verifies identity
- protected route checks whether access is allowed

Tip:
A user can be authenticated but still not authorized for some routes.

### 36. Why is the protected sidebar defined separately from the public header navigation?

Because public browsing and admin work have different information architecture.

Public nav focuses on:
- home
- about
- blog

Protected nav focuses on:
- posts
- uploads
- admin actions

Tip:
Separating user-facing and admin-facing navigation reduces clutter.

## Axios and API Questions

### 37. What is an Axios instance, and why is it useful?

An Axios instance is a reusable client with shared config.

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

Why useful:
- one place for base URL
- one place for interceptors
- consistent headers and credentials

### 38. What is the purpose of an Axios request interceptor?

It modifies requests before they are sent.

```js
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Use cases:
- attach auth token
- add trace headers
- normalize request config

### 39. What is the purpose of an Axios response interceptor?

It centralizes response handling.

```js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // try refresh logic
    }
    return Promise.reject(error);
  },
);
```

Use cases:
- token refresh
- common error formatting
- retry logic

### 40. Why does the client retry a request after refreshing the token?

Because the original request may fail only because the access token expired.

Flow:
1. request fails with `401`
2. refresh token endpoint returns a new JWT
3. original request is retried with the new token

Tip:
This improves UX because users are not forced to log in again immediately.

### 41. Why is the refresh flow centralized in `api-client.js` instead of each page?

Because token expiry is a shared concern, not a page-specific concern.

Bad approach:
- every page handles `401` itself

Better approach:
- API client handles it once

Benefits:
- less duplication
- consistent behavior
- easier maintenance

### 42. What is the difference between sending data in query params and JSON body params?

Query params go in the URL:

```js
GET /api/posts?page=1&limit=10
```

JSON body params go in the request body:

```json
{
  "post_title": "Hello",
  "post_body": "Body text"
}
```

Tip:
Use query params for filters, search, and pagination. Use JSON body params for create/update payloads.

### 43. Why do uploads use `multipart/form-data`?

Because files are binary data, not plain JSON.

```js
const formData = new FormData();
formData.append("files[]", file);

await api.post("/uploads", formData);
```

Tip:
Do not manually set the `Content-Type` boundary for `FormData` unless you know exactly what you are doing.

### 44. Why is a service-layer file like `posts.js` useful?

It separates API details from UI components.

```js
export async function getPosts(params) {
  return api.get("/posts", { params });
}
```

Then in a page:

```js
const response = await getPosts({ page: 1, limit: 10 });
```

Benefits:
- reusable
- easier to test
- cleaner pages

## Form and Validation Questions

### 45. Why does this project use `react-hook-form` instead of `useState` for every input?

Because large forms become repetitive with plain state.

With `react-hook-form`:

```jsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

<input {...register("email", { required: "Email is required" })} />
```

Benefits:
- less boilerplate
- better performance
- built-in validation patterns

### 46. What is the difference between controlled and uncontrolled form inputs?

Controlled input:

```jsx
const [value, setValue] = useState("");
<input value={value} onChange={(e) => setValue(e.target.value)} />
```

Uncontrolled/input registration pattern:

```jsx
<input {...register("email")} />
```

In practice:
- controlled inputs give direct React control
- uncontrolled patterns reduce render overhead

### 47. Why is frontend validation still useful even when the backend also validates?

Frontend validation improves UX:
- immediate feedback
- fewer bad submissions
- clearer field-level error messages

Example:

```jsx
<input
  {...register("postTitle", {
    required: "Title is required",
    minLength: {
      value: 5,
      message: "Title must be at least 5 characters",
    },
  })}
/>
```

Tip:
Backend validation is still the final authority.

### 48. Why is a hidden field used for `featuredImage` in the post form?

Because the user selects visually, but the backend expects an ID.

```jsx
<input type="hidden" {...register("featuredImage")} />
```

Flow:
1. user opens image picker
2. user selects an upload
3. form stores the upload id
4. submit payload sends the integer id

Tip:
This is a good example of separating display UI from data contract.

### 49. What problem does reusable validation logic solve in a larger codebase?

It prevents inconsistent rules across screens.

Without reuse:
- create form may require a field
- edit form may forget the same rule

With reuse:
- one shared form component or one shared validation schema

Tip:
Consistency matters more as the app grows.

### 50. Why should payload field names match backend naming exactly?

Because backend validators and controllers often depend on exact keys.

Wrong:

```json
{
  "postTitle": "Hello"
}
```

Expected:

```json
{
  "post_title": "Hello"
}
```

Tip:
Even if the value is correct, wrong field names can make the backend reject the request.

## UI and Architecture Questions

### 51. Why was the uploads page built as a grid instead of a plain list?

Uploads are visual assets. A grid is better for scanning images quickly.

Better for:
- thumbnails
- quick comparisons
- visual selection

Lists are better for:
- mostly text data
- dense tables
- logs or audit entries

### 52. Why was `object-contain` used for image previews?

Because it preserves aspect ratio without stretching.

```jsx
<img
  src={imageUrl}
  alt={altText}
  className="h-full w-full object-contain"
/>
```

Why this matters:
- prevents blurry stretching
- avoids cropping important parts
- works well for differently sized uploads

### 53. Why is a modal useful for upload metadata editing?

A modal lets the user stay in the current page context while focusing on one selected upload.

Advantages:
- no route change needed
- keeps the grid visible in the background
- good for quick edit tasks

Tip:
Modals work best for focused workflows, not giant multi-step pages.

### 54. Why is `PostForm` shared by both create and edit pages?

Because both pages use nearly the same fields and validation rules.

Benefits:
- less duplication
- same UX
- easier future changes

```jsx
<PostForm
  mode="create"
  defaultValues={...}
  onSubmit={handleCreate}
/>
```

```jsx
<PostForm
  mode="edit"
  defaultValues={...}
  onSubmit={handleUpdate}
/>
```

### 55. Why is `ErrorBoundary` useful in a React app?

It prevents a render crash from blanking the whole visible UI tree.

```jsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

If a child throws during rendering, the boundary shows fallback UI instead.

Tip:
Error boundaries catch render-time errors, not every async error.

### 56. Why should frontend UI copy avoid exposing backend endpoint details?

Because users care about actions and meaning, not internal implementation.

Bad copy:
- "Call `/api/posts/me` to continue"

Better copy:
- "Manage your posts from the dashboard"

Tip:
Technical details belong in docs and code comments, not end-user UI.

### 57. Why is a shared navigation file useful after adding both a header menu and a sidebar?

Because repeated route definitions drift over time.

Good pattern:

```js
export const publicLinks = [...]
export const privateLinks = [...]
```

Then reuse those definitions in:
- header
- mobile menu
- sidebar

Tip:
Shared config reduces mismatch bugs.

### 58. Why can client-side filtering on a paginated page become misleading?

Because you might only be filtering the currently loaded page, not the full dataset.

Example:
- page 1 has no drafts
- page 2 has many drafts
- client-side filter on page 1 says "no drafts"

Tip:
For large datasets, filtering should often happen on the backend.

### 59. Why is debounced search better than firing a request on every keystroke?

Debouncing waits briefly before sending the request.

```js
useEffect(() => {
  const timeout = setTimeout(() => {
    fetchResults(query);
  }, 300);

  return () => clearTimeout(timeout);
}, [query]);
```

Benefits:
- fewer requests
- smoother UI
- less backend load

### 60. Why is it useful to separate public pages from protected admin pages in the route tree?

Because it makes access rules and responsibilities clearer.

Public routes:
- accessible to anyone

Protected routes:
- accessible only after authentication

Benefits:
- cleaner mental model
- easier routing logic
- easier layout separation

Tip:
As apps grow, route grouping becomes even more important.
