import { useEffect, useState } from "react";

const initialState = {
  subject: "",
  question: "",
  answer: "",
  difficulty: "medium",
};

function FlashcardForm({ onSubmit, selectedCard, onCancelEdit }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (selectedCard) {
      setForm({
        subject: selectedCard.subject,
        question: selectedCard.question,
        answer: selectedCard.answer,
        difficulty: selectedCard.difficulty || "medium",
      });
    } else {
      setForm(initialState);
    }
  }, [selectedCard]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    if (!selectedCard) {
      setForm(initialState);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel space-y-3.5 p-5">
      <h2 className="text-lg font-semibold text-primary">
        {selectedCard ? "Edit Flashcard" : "Create Flashcard"}
      </h2>
      <input
        name="subject"
        value={form.subject}
        onChange={handleChange}
        placeholder="Subject"
        required
        className="field"
      />
      <textarea
        name="question"
        value={form.question}
        onChange={handleChange}
        placeholder="Question"
        required
        className="field"
        rows={3}
      />
      <textarea
        name="answer"
        value={form.answer}
        onChange={handleChange}
        placeholder="Answer"
        required
        className="field"
        rows={4}
      />
      <select
        name="difficulty"
        value={form.difficulty}
        onChange={handleChange}
        className="field"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div className="flex gap-2">
        <button className="btn-primary px-4 py-2" type="submit">
          {selectedCard ? "Update" : "Save"}
        </button>
        {selectedCard && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-secondary px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default FlashcardForm;
