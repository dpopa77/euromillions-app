import React, { useState } from "react";

function randomPick(pool, count) {
  const copy = [...pool];
  const out = [];
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length);
    out.push(copy[index]);
    copy.splice(index, 1);
  }
  return out;
}

function generateLine() {
  const mains = randomPick(
    Array.from({ length: 50 }, (_, i) => i + 1),
    5
  ).sort((a, b) => a - b);

  const stars = randomPick(
    Array.from({ length: 12 }, (_, i) => i + 1),
    2
  ).sort((a, b) => a - b);

  return { mains, stars };
}

function generateLines(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    ...generateLine(),
  }));
}

function Ball({ value, star = false }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 18,
        color: "white",
        background: star
          ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
          : "linear-gradient(135deg, #2563eb, #1d4ed8)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
      }}
    >
      {value}
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(5);
  const [lines, setLines] = useState(generateLines(5));
  const [status, setStatus] = useState("Ready");

  const generateLocal = () => {
    const safeCount = Math.max(1, Math.min(10, Number(count) || 5));
    setLines(generateLines(safeCount));
    setStatus("Generated locally");
  };

  const loadFromServer = async () => {
    try {
      setStatus("Loading from server...");
      const response = await fetch(`/api/generate?count=${count}`);
      const data = await response.json();

      if (!data.lines || !Array.isArray(data.lines)) {
        setStatus("Invalid server response");
        return;
      }

      setLines(
        data.lines.map((line, i) => ({
          id: i + 1,
          mains: line.mains,
          stars: line.stars,
        }))
      );
      setStatus("Loaded from server");
    } catch (error) {
      setStatus("Could not connect to server");
      console.error(error);
    }
  };

  const copyLines = async () => {
    const text = lines
      .map(
        (line) =>
          `Line ${line.id}: ${line.mains.join(", ")} | Stars: ${line.stars.join(", ")}`
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Copy failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        fontFamily: "Arial, sans-serif",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "white",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: 36, color: "#0f172a" }}>
          EuroMillions Generator
        </h1>

        <p style={{ color: "#475569", fontSize: 16 }}>
          Simple, clean, and connected to your server.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #cbd5e1",
              fontSize: 16,
              width: 100,
            }}
          />

          <button onClick={generateLocal} style={primaryButton}>
            Generate
          </button>

          <button onClick={loadFromServer} style={secondaryButton}>
            Server
          </button>

          <button onClick={copyLines} style={ghostButton}>
            Copy
          </button>
        </div>

        <div
          style={{
            marginBottom: 20,
            padding: 12,
            borderRadius: 12,
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 600,
          }}
        >
          Status: {status}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {lines.map((line) => (
            <div
              key={line.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                padding: 18,
                background: "#f8fafc",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>
                Line {line.id}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                {line.mains.map((n) => (
                  <Ball key={`m-${line.id}-${n}`} value={n} />
                ))}
              </div>

              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 10 }}>
                Lucky Stars
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {line.stars.map((n) => (
                  <Ball key={`s-${line.id}-${n}`} value={n} star />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const primaryButton = {
  padding: "12px 16px",
  border: "none",
  borderRadius: 12,
  background: "#2563eb",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton = {
  padding: "12px 16px",
  border: "none",
  borderRadius: 12,
  background: "#0f766e",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const ghostButton = {
  padding: "12px 16px",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "white",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
};