export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-2 px-4 py-8 text-sm text-secondary md:flex-row md:items-center md:justify-between">
        <p>Sameer&apos;s Code Lab frontend shell for blog, auth, uploads, and author workflows.</p>
        <p>Built with React, Tailwind, and a custom PHP API contract in mind.</p>
      </div>
    </footer>
  );
}
