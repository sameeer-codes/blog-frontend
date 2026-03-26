# Frontend Review Answers

## React and JSX Syntax

1. `useState` stores mutable component state, while `useMemo` memoizes a computed value so it is only recalculated when dependencies change.
2. `useEffect(() => {}, [])` runs the effect once after the component mounts.
3. `useCallback` helps keep a function reference stable so dependent effects or consumers do not rerun unnecessarily.
4. The dependency array tells React when the effect should rerun.
5. Leaving out a real dependency can make the effect use stale values or skip updates.
6. `children` is whatever is placed between a component’s opening and closing tags, while props like `title` are named inputs passed explicitly.
7. `{isLoggedIn && <Panel />}` means “render `<Panel />` only if `isLoggedIn` is truthy.”
8. A ternary chooses between two outcomes, while `&&` only conditionally renders one branch.
9. React uses keys to identify list items between renders and update them efficiently.
10. Optional chaining avoids runtime errors when trying to read a property from `null` or `undefined`.
11. `className` is the React prop for CSS classes because `class` is a reserved JavaScript keyword.
12. `htmlFor` is the React-friendly version of the HTML `for` attribute.

## React Hooks and State Questions

13. `useEffect` is used for data fetching because fetching is a side effect that should run after render.
14. A derived value is computed from other state or props, and `useMemo` avoids recomputing it on every render when inputs have not changed.
15. State should hold source-of-truth values that change over time; values that can be computed from that state should usually be derived.
16. Local component state is private to one component; context state is shared across many components.
17. Auth is stored in context because many parts of the app need access to login state and auth actions.
18. A stale closure happens when a function captures old variable values and keeps using them after state changed.
19. Async code can finish later than expected and update state using outdated assumptions.
20. Cleanup logic prevents memory leaks, duplicate subscriptions, and state updates after unmount.

## JavaScript Syntax and Language Questions

21. `const` cannot be reassigned, `let` can be reassigned, and `var` is function-scoped and generally avoided in modern code.
22. `===` checks both value and type, while `==` performs type coercion.
23. `null` means an intentional empty value, `undefined` means not assigned, and `""` is an empty string.
24. `Number(values.featuredImage)` converts the selected upload id from a string form value into a numeric payload for the backend.
25. `[...publicLinks, ...privateLinks]` creates a new array by copying items from both arrays.
26. `{ ...post, featured_image: id }` copies an object and overrides or adds the `featured_image` property.
27. `map` transforms every item, `filter` keeps matching items, and `find` returns the first matching item.
28. `async/await` usually makes asynchronous code easier to read and reason about than nested promise chains.
29. `try` runs guarded code, `catch` handles thrown errors, and `finally` runs whether the code succeeds or fails.
30. A function declaration is hoisted and named normally; an arrow function is an expression and has lexical `this`.

## Routing and Authorization Questions

31. They solve different access rules: `ProtectedRoute` blocks anonymous users, while `GuestRoute` blocks authenticated users from guest-only pages.
32. Nested routing lets the protected pages share one layout, sidebar, and shell without duplicating that structure on every page.
33. A route param is part of the path like `/blog/:slug`, while a query param is added after `?`, such as `?page=2`.
34. Because the `slug` segment changes based on the selected post.
35. Authentication proves who the user is; authorization controls what they are allowed to access.
36. Public and protected navigation serve different information architectures, so separating them keeps the UI cleaner and easier to maintain.

## Axios and API Questions

37. An Axios instance is a preconfigured client with shared defaults like `baseURL`, headers, and interceptors.
38. A request interceptor can attach the bearer token before the request is sent.
39. A response interceptor can handle common failures such as `401` responses and retry logic.
40. Because the access token may expire while the refresh token can still issue a new one.
41. Centralizing refresh logic avoids duplicating auth-recovery code in every page and keeps behavior consistent.
42. Query params usually represent URL-based filters or identifiers, while JSON body params represent structured request payload data.
43. File uploads need `multipart/form-data` so binary files and form fields can be transmitted together.
44. A service layer keeps API details out of UI components and improves reuse and maintainability.

## Form and Validation Questions

45. `react-hook-form` reduces repetitive boilerplate, improves performance, and keeps validation handling structured.
46. Controlled inputs store their value in React state, while uncontrolled inputs rely more on the DOM and refs.
47. Frontend validation gives faster feedback, improves UX, and can prevent obviously invalid submissions before the request is sent.
48. The hidden field stores the selected upload id even though the user selects the image visually through a modal.
49. Reusable validation logic keeps behavior consistent and reduces duplicated rules across forms.
50. Exact field names matter because backend validators and controllers often depend on precise payload keys.

## UI and Architecture Questions

51. A grid is better for visual browsing of media and post cards because scanning thumbnails and summaries is faster than reading a list.
52. `object-contain` preserves the natural aspect ratio and prevents stretched or cropped previews.
53. A modal keeps the user in context while exposing more detail and editing controls for one selected upload.
54. Sharing `PostForm` reduces duplication and keeps create/edit validation and field structure consistent.
55. `ErrorBoundary` catches render-time failures and shows a fallback UI instead of crashing the whole visible app tree.
56. Frontend copy should focus on the user experience, not internal API details that add noise and reduce polish.
57. A shared navigation file prevents route labels and paths from drifting between different navigation surfaces.
58. Because the user may think they are filtering the full dataset when they are only filtering the currently fetched page.
59. Debouncing reduces unnecessary requests and keeps the page from visibly reloading on every keystroke.
60. It makes access rules, layouts, and responsibilities clearer and easier to reason about.
