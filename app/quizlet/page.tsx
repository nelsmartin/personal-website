"use client";

import { useState, useEffect, useRef } from "react";

type Card = { term: string; definition: string };
type Deck = { id: string; name: string; cards: Card[] };

const STORAGE_KEY = "quizlet-decks";

export default function QuizletPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<
    | { kind: "list" }
    | { kind: "edit"; deckId: string }
    | { kind: "view"; deckId: string }
  >({ kind: "list" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDecks(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }, [decks, loaded]);

  const createDeck = () => {
    const id = crypto.randomUUID();
    setDecks((d) => [
      ...d,
      { id, name: "Untitled Deck", cards: [{ term: "", definition: "" }] },
    ]);
    setView({ kind: "edit", deckId: id });
  };

  const updateDeck = (id: string, fn: (d: Deck) => Deck) => {
    setDecks((ds) => ds.map((d) => (d.id === id ? fn(d) : d)));
  };

  const deleteDeck = (id: string) => {
    setDecks((ds) => ds.filter((d) => d.id !== id));
  };

  if (!loaded) return <div className="min-h-screen bg-amber-50" />;

  if (view.kind === "edit") {
    const deck = decks.find((d) => d.id === view.deckId);
    if (!deck) {
      setView({ kind: "list" });
      return null;
    }
    return (
      <EditDeck
        deck={deck}
        onChange={(fn) => updateDeck(deck.id, fn)}
        onDone={() => setView({ kind: "list" })}
        onStudy={() => setView({ kind: "view", deckId: deck.id })}
      />
    );
  }

  if (view.kind === "view") {
    const deck = decks.find((d) => d.id === view.deckId);
    if (!deck) {
      setView({ kind: "list" });
      return null;
    }
    return (
      <ViewDeck
        deck={deck}
        onBack={() => setView({ kind: "list" })}
        onEdit={() => setView({ kind: "edit", deckId: deck.id })}
      />
    );
  }

  return (
    <main className="min-h-screen w-full bg-amber-50 flex flex-col items-center p-8" style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 className="text-6xl font-bold mt-8 mb-8">Flashcards</h1>
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <button
          onClick={createDeck}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold py-3 px-6 rounded-lg cursor-pointer"
        >
          + New Deck
        </button>
        {decks.length === 0 ? (
          <p className="text-center text-gray-500 text-xl mt-8">
            No decks yet. Create one to get started.
          </p>
        ) : (
          decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold">{deck.name}</h2>
                <p className="text-gray-500">
                  {deck.cards.length}{" "}
                  {deck.cards.length === 1 ? "card" : "cards"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView({ kind: "view", deckId: deck.id })}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Study
                </button>
                <button
                  onClick={() => setView({ kind: "edit", deckId: deck.id })}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${deck.name}"?`)) deleteDeck(deck.id);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

function AutoTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      el.style.height = "0px";
      el.style.height = `${el.scrollHeight}px`;
    };
    const id = requestAnimationFrame(resize);
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-lg resize-none overflow-hidden"
    />
  );
}

function EditDeck({
  deck,
  onChange,
  onDone,
  onStudy,
}: {
  deck: Deck;
  onChange: (fn: (d: Deck) => Deck) => void;
  onDone: () => void;
  onStudy: () => void;
}) {
  const setName = (name: string) => onChange((d) => ({ ...d, name }));
  const setCard = (i: number, c: Card) =>
    onChange((d) => ({
      ...d,
      cards: d.cards.map((x, idx) => (idx === i ? c : x)),
    }));
  const addCard = () =>
    onChange((d) => ({
      ...d,
      cards: [...d.cards, { term: "", definition: "" }],
    }));
  const removeCard = (i: number) =>
    onChange((d) => ({ ...d, cards: d.cards.filter((_, idx) => idx !== i) }));
  const flipAll = () =>
    onChange((d) => ({
      ...d,
      cards: d.cards.map((c) => ({ term: c.definition, definition: c.term })),
    }));

  return (
    <main className="min-h-screen w-full bg-amber-50 flex flex-col items-center p-8" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onDone}
            className="text-blue-600 hover:underline text-lg cursor-pointer"
          >
            ← Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={flipAll}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Flip all terms ↔ definitions
            </button>
            <button
              onClick={onStudy}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Study
            </button>
          </div>
        </div>
        <input
          value={deck.name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Deck name"
          className="w-full text-4xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none pb-2 mb-8"
        />
        <div className="flex flex-col gap-4">
          {deck.cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-4 flex gap-4 items-start"
            >
              <span className="text-gray-400 font-semibold pt-2 w-8">
                {i + 1}
              </span>
              <div className="flex-1 flex flex-col gap-2">
                <AutoTextarea
                  value={card.term}
                  onChange={(v) => setCard(i, { ...card, term: v })}
                  placeholder="Term"
                />
                <AutoTextarea
                  value={card.definition}
                  onChange={(v) => setCard(i, { ...card, definition: v })}
                  placeholder="Definition"
                />
              </div>
              <button
                onClick={() => removeCard(i)}
                className="text-red-500 hover:text-red-700 text-2xl px-2 cursor-pointer"
                aria-label="Remove card"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addCard}
          className="mt-4 w-full bg-white hover:bg-gray-100 border-2 border-dashed border-gray-400 text-gray-600 py-4 rounded-lg text-lg cursor-pointer"
        >
          + Add card
        </button>
      </div>
    </main>
  );
}

function ViewDeck({
  deck,
  onBack,
  onEdit,
}: {
  deck: Deck;
  onBack: () => void;
  onEdit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const cards = deck.cards;
  const safeIndex = Math.min(index, Math.max(0, cards.length - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight")
        setIndex((i) => Math.min(i + 1, cards.length - 1));
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      else if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => ({ ...f, [safeIndex]: !f[safeIndex] }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cards.length, safeIndex]);

  if (cards.length === 0) {
    return (
      <main className="min-h-screen w-full bg-amber-50 flex flex-col items-center p-8" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="w-full max-w-3xl flex justify-between mb-4">
          <button
            onClick={onBack}
            className="text-blue-600 hover:underline text-lg cursor-pointer"
          >
            ← Back
          </button>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline text-lg cursor-pointer"
          >
            Edit
          </button>
        </div>
        <p className="text-gray-500 text-xl mt-20">This deck has no cards.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-amber-50 flex flex-col items-center p-8" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="w-full max-w-5xl flex justify-between mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:underline text-lg cursor-pointer"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{deck.name}</h1>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:underline text-lg cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="w-full max-w-5xl relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="min-w-full flex items-center justify-center px-2"
            >
              <button
                onClick={() =>
                  setFlipped((f) => ({ ...f, [i]: !f[i] }))
                }
                className="w-full h-96 bg-white rounded-2xl shadow-lg flex items-center justify-center p-8 cursor-pointer hover:shadow-xl transition-shadow"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="w-full h-full relative transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped[i] ? "rotateY(180deg)" : "none",
                  }}
                >
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <p className="text-sm text-gray-400 mb-4">Term</p>
                    <p className="text-4xl font-semibold text-center">
                      {card.term || <span className="text-gray-300">(empty)</span>}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-4">Definition</p>
                    <p className="text-3xl text-center">
                      {card.definition || (
                        <span className="text-gray-300">(empty)</span>
                      )}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={safeIndex === 0}
          className="bg-gray-700 hover:bg-gray-800 disabled:opacity-30 text-white text-xl w-12 h-12 rounded-full cursor-pointer"
        >
          ←
        </button>
        <span className="text-xl font-semibold">
          {safeIndex + 1} / {cards.length}
        </span>
        <button
          onClick={() =>
            setIndex((i) => Math.min(i + 1, cards.length - 1))
          }
          disabled={safeIndex === cards.length - 1}
          className="bg-gray-700 hover:bg-gray-800 disabled:opacity-30 text-white text-xl w-12 h-12 rounded-full cursor-pointer"
        >
          →
        </button>
      </div>
      <p className="text-gray-500 text-sm mt-4">
        Click card to flip · ← → to navigate · space to flip
      </p>
    </main>
  );
}
