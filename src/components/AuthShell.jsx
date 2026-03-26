import { Link } from "react-router";
import { BiArrowBack } from "react-icons/bi";

const checklist = [
  "Private admin authentication shell before API wiring",
  "Validation-friendly layout with space for backend error states",
  "Clear path into the protected admin dashboard after sign-in",
];

export default function AuthShell({
  title,
  description,
  footer,
  children,
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <section className="rounded-[32px] bg-slate-900 p-8 text-white shadow-soft md:p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
          >
            <BiArrowBack /> Back to Home
          </Link>
          <div className="mt-10 space-y-5">
            <p className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Admin Access
            </p>
            <h1 className="max-w-xl text-4xl leading-tight md:text-5xl">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-300">
              {description}
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {checklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur md:p-8">
          {children}
          {footer && (
            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-secondary">
              {footer}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
