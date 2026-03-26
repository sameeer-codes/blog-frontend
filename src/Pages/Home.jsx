import { Link } from "react-router";
import Header from "../components/Header";
import ActionButton from "../ui/ActionButton";

const publicFlows = [
  {
    title: "Browse published posts",
    description:
      "A public post index with search, featured content, and detail pages for published writing.",
    link: "/blog",
  },
  {
    title: "Read individual articles",
    description:
      "Single post layouts designed for post titles, excerpts, featured imagery, and full article bodies.",
    link: "/blog/custom-php-blog-architecture",
  },
];

const authorFlows = [
  "Private admin login and signup flow for site management only",
  "Create, edit, and review blog posts across draft, published, and archived states",
  "Media uploads workspace for images, metadata edits, and file management",
];

function Home() {
  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(84,125,214,0.1),_transparent_34%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1280px] flex-col justify-center gap-10 px-4 py-16 lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-1 space-y-6">
            <p className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Blog Frontend Workspace
            </p>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">
                Sameer&apos;s Code Lab is shaping into a complete blog and author dashboard.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-secondary">
                The current frontend now has the right page surface for public reading,
                private admin access, post management, and media administration. API wiring can
                be layered in next without restructuring the app.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <ActionButton to="/blog" variant="primary" classes="self-start">
                Explore Blog Pages
              </ActionButton>
              <ActionButton
                to="/posts/me"
                variant="secondary"
                classes="px-6 py-4"
              >
                Review Author Screens
              </ActionButton>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-7 text-secondary shadow-soft">
              The current goal is clarity over live data. Each page is now shaped to match
              the backend contract, but the interactions stay lightweight and instructional
              until API validation and payload mapping are added.
            </div>
          </div>

          <div className="grid flex-1 gap-6">
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur">
              <h2 className="mb-4 text-2xl">Public reading flows</h2>
              <div className="space-y-4">
                {publicFlows.map((flow) => (
                  <Link
                    key={flow.title}
                    to={flow.link}
                    className="block rounded-2xl border border-slate-200 p-5 hover:border-accent-primary hover:bg-slate-50"
                  >
                    <h3 className="text-lg">{flow.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-secondary">
                      {flow.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="mb-4 text-2xl">Admin flows</h2>
              <ul className="space-y-3 text-sm leading-7 text-secondary">
                {authorFlows.map((flow) => (
                  <li key={flow} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {flow}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
