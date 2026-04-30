import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user } = useAuth();

  return (
    <main className="mx-auto mt-8 max-w-6xl px-4 pb-12">
      <section className="hero-card mb-6 rounded-2xl p-7 text-white">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-white/80">Exam Prep Control Center</p>
        <h1 className="text-3xl font-black leading-tight md:text-4xl">Welcome to FLASHMASTER, {user?.name}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-100/90">
          Organize cards, revise faster, and track your preparation like a serious engineering project.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/flashcards" className="btn-primary px-4 py-2">Open My Flashcards</Link>
          {user?.role === "admin" && <Link to="/admin" className="btn-secondary px-4 py-2">Open Admin Panel</Link>}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Quick Start</h2>
          <p className="mt-2 text-sm text-slate-700">Create subject-wise cards, keep answers concise, and revise daily.</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Interview Ready</h2>
          <p className="mt-2 text-sm text-slate-700">Practice flashcards for JavaScript, React, Node, MongoDB, and DSA concepts.</p>
        </article>
        <article className="panel p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Role</h2>
          <p className="mt-2 text-sm text-slate-700">
            Signed in as <span className="font-bold capitalize text-slate-900">{user?.role || "user"}</span>.
          </p>
        </article>
      </section>
    </main>
  );
}

export default HomePage;
