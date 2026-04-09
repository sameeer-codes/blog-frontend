import { Link } from "react-router";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const quickLinks = [
  {
    title: "Users",
    description: "List users, open user details, update status, and change role.",
    to: "/admin/users",
  },
  {
    title: "Posts",
    description: "Moderate post status, open admin editing, and delete posts.",
    to: "/admin/posts",
  },
  {
    title: "Uploads",
    description: "Edit upload metadata and remove uploads when needed.",
    to: "/admin/uploads",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin Panel"
        title="Admin workspace"
        description="Use the sections below to manage users, posts, and uploads against the current admin API."
      />

      <section className="grid gap-4 xl:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-900"
          >
            <h2 className="text-2xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-secondary">
              {item.description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
