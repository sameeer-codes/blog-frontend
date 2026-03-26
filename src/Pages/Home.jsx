import Header from "../components/Header";
import ActionButton from "../ui/ActionButton";

const principles = [
  "Public readers and private admin tools share one frontend codebase.",
  "Reusable forms and upload pickers reduce duplication across create and edit flows.",
  "Routing, auth, and API access are split into clear layers for maintainability.",
];

const techniques = [
  "React Router for route composition and protection",
  "React Context for session state and auth actions",
  "Axios interceptors for token injection and refresh handling",
  "react-hook-form for structured validation and submission flow",
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
                A practice project for building a modern blog frontend with a private admin workflow.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-secondary">
                This project focuses on real frontend architecture: public content pages,
                protected admin routes, API-driven forms, uploads management, and session-based
                authentication.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <ActionButton
                to="/about"
                variant="secondary"
                classes="px-6 py-4"
              >
                About This Project
              </ActionButton>
              <ActionButton
                to="/posts/me"
                variant="dark"
                classes="px-6 py-4"
              >
                Open Admin Workspace
              </ActionButton>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-7 text-secondary shadow-soft">
              It is intentionally structured like a small production-style app so the code
              can be reviewed for routing, state, API integration, and UI composition skills.
            </div>
          </div>

          <div className="grid flex-1 gap-6">
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur">
              <h2 className="mb-4 text-2xl">Project Principles</h2>
              <div className="space-y-4">
                {principles.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <p className="text-sm leading-7 text-secondary">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="mb-4 text-2xl">Methods And Tools</h2>
              <ul className="space-y-3 text-sm leading-7 text-secondary">
                {techniques.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    {item}
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
