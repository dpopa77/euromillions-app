import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, "dist")));

function getRandom(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  return result;
}

function generateLine() {
  const mains = getRandom(
    Array.from({ length: 50 }, (_, i) => i + 1),
    5
  ).sort((a, b) => a - b);

  const stars = getRandom(
    Array.from({ length: 12 }, (_, i) => i + 1),
    2
  ).sort((a, b) => a - b);

  return { mains, stars };
}

app.get("/api/generate", (req, res) => {
  const count = Math.min(12, Math.max(1, Number(req.query.count) || 5));
  const lines = Array.from({ length: count }, () => generateLine());
  res.json({ lines });
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});