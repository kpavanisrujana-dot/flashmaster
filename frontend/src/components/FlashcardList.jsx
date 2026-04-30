function FlashcardList({ cards, onEdit, onDelete }) {
  if (!cards.length) {
    return (
      <div className="panel p-6 text-center text-slate-600">
        No flashcards yet. Add your first card to begin revision.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <article
          key={card._id}
          className="panel border-l-4 border-l-primary p-4 transition-transform duration-150 hover:-translate-y-0.5"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-soft px-2 py-1 text-xs font-semibold uppercase text-primary">
              {card.subject}
            </span>
            <span className="text-xs capitalize text-slate-500">{card.difficulty}</span>
          </div>
          <h3 className="mb-1 text-slate-900 font-semibold">Q: {card.question}</h3>
          <p className="mb-3 text-sm text-slate-700">A: {card.answer}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(card)}
              className="btn-secondary px-3 py-1 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(card._id)}
              className="rounded border border-[#f44336] bg-accent px-3 py-1 text-sm font-semibold text-white shadow-sm"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default FlashcardList;
