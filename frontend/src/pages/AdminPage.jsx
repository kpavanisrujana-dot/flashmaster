import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

const emptyForm = {
  userId: "",
  subject: "",
  question: "",
  answer: "",
  difficulty: "medium",
};

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((u) => map.set(u._id, u));
    return map;
  }, [users]);

  const loadAdminData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, cardsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/flashcards"),
      ]);
      setUsers(usersRes.data);
      setCards(cardsRes.data);
      if (!form.userId && usersRes.data.length) {
        setForm((prev) => ({ ...prev, userId: usersRes.data[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/admin/flashcards/${editingId}`, form);
      } else {
        await api.post("/admin/flashcards", form);
      }
      setForm((prev) => ({ ...emptyForm, userId: prev.userId || users[0]?._id || "" }));
      setEditingId(null);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save flashcard");
    }
  };

  const startEdit = (card) => {
    setEditingId(card._id);
    setForm({
      userId: card.user?._id || card.user,
      subject: card.subject,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty || "medium",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeCard = async (id) => {
    setError("");
    try {
      await api.delete(`/admin/flashcards/${id}`);
      await loadAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete flashcard");
    }
  };

  return (
    <main className="mx-auto mt-8 max-w-7xl px-4 pb-12">
      <section className="admin-banner mb-6 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-black">Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-100">Manage users and all flashcards across the platform.</p>
      </section>

      {error && <p className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading && <p className="mb-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">Loading admin data...</p>}

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 text-2xl font-black text-primary">{users.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Flashcards</p>
          <p className="mt-2 text-2xl font-black text-primary">{cards.length}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Admin Actions</p>
          <p className="mt-2 text-sm text-slate-700">Create, update, and delete cards for any user.</p>
        </article>
      </section>

      <section className="mb-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="panel p-5">
          <h2 className="mb-3 text-lg font-bold text-primary">Users</h2>
          <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
            {users.map((user) => (
              <div key={user._id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">{user.email}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-primary">Role: {user.role}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="panel space-y-3.5 p-5">
          <h2 className="text-lg font-bold text-primary">{editingId ? "Edit Flashcard (Admin)" : "Create Flashcard For User"}</h2>
          <select name="userId" value={form.userId} onChange={handleChange} required className="field">
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <input className="field" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required />
          <textarea className="field" name="question" value={form.question} onChange={handleChange} rows={3} placeholder="Question" required />
          <textarea className="field" name="answer" value={form.answer} onChange={handleChange} rows={4} placeholder="Answer" required />
          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="field">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary px-4 py-2">{editingId ? "Update" : "Create"}</button>
            {editingId && (
              <button
                type="button"
                className="btn-secondary px-4 py-2"
                onClick={() => {
                  setEditingId(null);
                  setForm((prev) => ({ ...emptyForm, userId: prev.userId || users[0]?._id || "" }));
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel p-5">
        <h2 className="mb-3 text-lg font-bold text-primary">All Flashcards</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const owner = card.user?._id ? card.user : userMap.get(card.user);
            return (
              <article key={card._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{card.subject}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Q: {card.question}</p>
                <p className="mt-1 text-sm text-slate-700">A: {card.answer}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Owner: {owner?.name || "Unknown"} ({owner?.email || "N/A"})
                </p>
                <p className="text-xs capitalize text-slate-500">Difficulty: {card.difficulty}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn-secondary px-3 py-1 text-sm" onClick={() => startEdit(card)}>Edit</button>
                  <button
                    className="rounded border border-[#e05845] bg-accent px-3 py-1 text-sm font-semibold text-white"
                    onClick={() => removeCard(card._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
