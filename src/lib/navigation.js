export const publicLinks = [
  {
    key: "Home",
    value: "/",
  },
  {
    key: "About",
    value: "/about",
  },
  {
    key: "Blog",
    value: "/blog",
  },
];

export const privateLinks = [
  {
    key: "Admin",
    value: "/admin",
    description: "Open the moderation dashboard.",
  },
  {
    key: "My Posts",
    value: "/posts/me",
    description: "View and filter your current post library.",
  },
  {
    key: "Create Post",
    value: "/post/create",
    description: "Write and publish a new article.",
  },
  {
    key: "Uploads",
    value: "/uploads",
    description: "Manage the media library and image metadata.",
  },
];

export const adminNavigationSections = [
  {
    title: "Moderation",
    links: [
      {
        key: "Dashboard",
        value: "/admin",
      },
      {
        key: "Users",
        value: "/admin/users",
      },
      {
        key: "Posts",
        value: "/admin/posts",
      },
      {
        key: "Media",
        value: "/admin/uploads",
      },
    ],
  },
  {
    title: "Workspace",
    links: [
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
    ],
  },
];
