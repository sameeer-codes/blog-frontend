import Header from "../components/Header";
import Footer from "../components/Footer";

const focusAreas = [
  "React routing for public and private application flows",
  "JWT-based authentication with refresh-token session recovery",
  "Reusable forms, modal pickers, and media management patterns",
  "Axios service layers, interceptors, and API response normalization",
  "Frontend architecture choices that scale from a small project into a portfolio-ready admin app",
];

const processSteps = [
  "Start with a route map for readers and the private admin area.",
  "Build reusable UI primitives and shared layouts before wiring data.",
  "Create post, upload, and auth flows as real page surfaces first.",
  "Integrate the backend contract through service modules and the auth context.",
  "Refine the UI so the app reads like a finished practice project instead of a prototype.",
];

export default function About() {
  return (
    <>
      <Header />
      <main className="bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <section className="mx-auto w-full max-w-[1180px] px-4 py-14">
          <div className="rounded-[32px] bg-white p-8 shadow-soft md:p-10">
            <p className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Practice Project
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-tight md:text-6xl">
              A frontend practice build for blog publishing, private admin tools, and API-driven workflows.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-secondary">
              This project was built to practice real frontend architecture: route protection,
              reusable forms, media management, paginated data, and clean separation between
              UI, state, and API access.
            </p>
          </div>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] bg-white p-6 shadow-soft md:p-8">
              <h2 className="text-2xl">Theory Behind It</h2>
              <p className="mt-4 text-base leading-8 text-secondary">
                The app is designed around a simple idea: public readers should get a clean
                content experience, while the admin side should feel like a focused workspace
                for writing, editing, filtering, uploading, and managing assets. The practice
                value comes from implementing the full flow instead of isolated UI screens.
              </p>
              <p className="mt-4 text-base leading-8 text-secondary">
                It also explores an important frontend skill: translating backend payloads,
                route contracts, and authentication rules into predictable React code that
                remains readable as the project grows.
              </p>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-soft md:p-8">
              <h2 className="text-2xl">Focus Areas</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-secondary">
                {focusAreas.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-10 rounded-[28px] bg-white p-6 shadow-soft md:p-8">
            <h2 className="text-2xl">How It Was Built</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {processSteps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
