import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="mx-auto mt-10 max-w-md panel p-7">
      <h1 className="mb-1 text-3xl font-bold text-primary">Create Account</h1>
      <p className="mb-5 text-sm text-slate-600">Start building your flashcard bank.</p>
      {error && <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <input
          className="field"
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
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
          minLength={6}
        />
        <button className="btn-primary w-full py-2.5" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-700">
        Already have an account? <Link to="/login" className="text-primary underline">Login</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
