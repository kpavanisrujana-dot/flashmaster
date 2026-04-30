import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      if (!err.response) {
        setError("Backend is not running. Start backend and verify the API URL in your frontend .env.");
        return;
      }
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-md panel p-7">
      <h1 className="mb-1 text-3xl font-bold text-primary">Welcome Back</h1>
      <p className="mb-5 text-sm text-slate-600">Login to continue your revision sessions.</p>
      {error && <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <input
          className="field"
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="field"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="btn-primary w-full py-2.5" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-700">
        New user? <Link to="/register" className="text-primary underline">Register</Link>
      </p>
    </main>
  );
}

export default LoginPage;
