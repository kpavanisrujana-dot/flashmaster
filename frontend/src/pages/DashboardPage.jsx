import { useEffect, useState } from "react";
import FlashcardForm from "../components/FlashcardForm";
import FlashcardList from "../components/FlashcardList";
import api from "../services/api";

function DashboardPage() {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState("");

  const loadCards = async () => {
    try {
      const { data } = await api.get("/flashcards");
      setCards(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load flashcards");
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleSave = async (payload) => {
    setError("");
    try {
      if (selectedCard) {
        await api.put(`/flashcards/${selectedCard._id}`, payload);
        setSelectedCard(null);
      } else {
        await api.post("/flashcards", payload);
      }
      await loadCards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save flashcard");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/flashcards/${id}`);
      await loadCards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete flashcard");
    }
  };

  return (
    <main className="mx-auto mt-8 max-w-6xl px-4 pb-10">
      <section className="panel mb-6 p-5">
        <h1 className="text-3xl font-bold text-primary">My Flashcards Workspace</h1>
        <p className="mt-1 text-sm text-slate-600">
          Build revision flashcards, update them as you study, and keep your prep focused.
        </p>
      </section>

      {error && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <section className="mb-6">
        <FlashcardForm
          onSubmit={handleSave}
          selectedCard={selectedCard}
          onCancelEdit={() => setSelectedCard(null)}
        />
      </section>

      <section>
        <FlashcardList cards={cards} onEdit={setSelectedCard} onDelete={handleDelete} />
      </section>
    </main>
  );
}

export default DashboardPage;
