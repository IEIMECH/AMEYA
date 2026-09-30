"use client";

import { useEffect, useState, useRef } from "react";
import { Send, ShieldAlert } from "lucide-react";

const initialLines = [
  "Ameya 2026: Machined Crimson & Cold Steel! ⚡",
  "Official event registrations now live! ⚙️",
  "AutoCAD precision drafting slots filling fast! 📐",
  "RC Car Challenge obstacle track primed! 🏎️",
  "Assemble & Disassemble: Show your mechanical speed! 🔧",
  "Engineering Drawing & Drafting standards ready! ✏️",
  "Mechanical engineers assemble at VVITU! 🚀",
  "Treasure Hunt clue matrix deployed! 🧭",
  "Nuts & Bolts Speed Race: Rapid threading challenge! 🔩",
  "October 8–9, 2026: Mark your engineering calendars!",
  "Official technical conclave by IEI SAME council! 🛡️",
];

interface FloatingItem {
  id: number;
  text: string;
  row: number;
  speed: number;
  color: string;
}

export default function Danmaku() {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [userInput, setUserInput] = useState("");
  const nextId = useRef(0);

  // Machined Crimson & Cold Steel palette
  const colors = ["#e61d1d", "#ff3b3b", "#ffffff", "#d8d8d8", "#888888", "#ff5555"];

  useEffect(() => {
    const rows = 4;
    const initial = initialLines.map((text, idx) => ({
      id: nextId.current++,
      text,
      row: idx % rows,
      speed: 18 + (idx % 3) * 6,
      color: colors[idx % colors.length],
    }));
    setItems(initial);

    const interval = setInterval(() => {
      const randomLine = initialLines[Math.floor(Math.random() * initialLines.length)];
      setItems((prev) => [
        ...prev.slice(-15),
        {
          id: nextId.current++,
          text: randomLine,
          row: Math.floor(Math.random() * rows),
          speed: 16 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setItems((prev) => [
      ...prev,
      {
        id: nextId.current++,
        text: `⚡ ${userInput.trim()}`,
        row: Math.floor(Math.random() * 4),
        speed: 14,
        color: "#ff3b3b",
      },
    ]);
    setUserInput("");
  };

  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        padding: "3.5rem 0 3rem 0",
        background: "#0c0c0c",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 1.5rem", marginBottom: "1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#ff3b3b", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Live Stream Cheer Wall // Telemetry
          </span>
          <h3 style={{ margin: "4px 0 0 0", fontFamily: "var(--font-display)", color: "#ffffff", fontSize: "1.35rem", fontWeight: 800 }}>
            Community Danmaku Stream
          </h3>
        </div>

        <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
          <input
            suppressHydrationWarning
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Send cheer to live telemetry wall..."
            maxLength={60}
            style={{
              padding: "8px 16px",
              borderRadius: "3px",
              background: "rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontFamily: "var(--font-mono)",
              outline: "none",
              width: "260px",
            }}
          />
          <button
            suppressHydrationWarning
            type="submit"
            className="btn-primary"
            style={{
              padding: "8px 18px",
              fontSize: "0.82rem",
            }}
          >
            <Send size={13} />
            Post
          </button>
        </form>
      </div>

      <div style={{ position: "relative", height: "170px", overflow: "hidden" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: `${item.row * 40}px`,
              whiteSpace: "nowrap",
              fontSize: "1.05rem",
              fontWeight: 800,
              fontFamily: "var(--font-mono)",
              color: item.color,
              opacity: 0.9,
              textShadow: `0 0 12px ${item.color}66`,
              animation: `danmakuFloat ${item.speed}s linear forwards`,
              pointerEvents: "none",
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
    </section>
  );
}
