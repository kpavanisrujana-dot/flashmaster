import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200/80 bg-primary text-white px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide">
          FLASHMASTER
        </Link>
        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/" className="rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/10">
              Home
            </Link>
            <Link
              to="/flashcards"
              className="rounded px-2 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/10"
            >
              My Cards
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide"
              >
                Admin
              </Link>
            )}
            <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm">
              Hi, {user.name}
            </span>
            <button
              onClick={logout}
              className="rounded border border-white/25 bg-accent px-3 py-2 text-sm font-semibold shadow"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 text-sm">
            <Link to="/login" className="rounded px-2 py-1 underline decoration-white/70 underline-offset-4">
              Login
            </Link>
            <Link to="/register" className="rounded px-2 py-1 underline decoration-white/70 underline-offset-4">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
