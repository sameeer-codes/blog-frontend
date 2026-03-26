import Header from "./components/Header";
import ActionButton from "./ui/ActionButton";

function NotFound() {
  return (
    <>
      <Header />
      <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-slate-50 px-4">
        <div className="max-w-xl rounded-[32px] bg-white p-10 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
            404
          </p>
          <h1 className="mt-3 text-4xl">This page does not exist in the current frontend map.</h1>
          <p className="mt-4 text-base leading-8 text-secondary">
            The route either has not been built yet or the URL is incorrect.
          </p>
          <ActionButton to="/" variant="dark" classes="mt-8">
            Return home
          </ActionButton>
        </div>
      </main>
    </>
  );
}

export default NotFound;
