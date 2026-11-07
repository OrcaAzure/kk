import cors from "cors";
import express from "express";
import { getContacts, getPage, listPages } from "./store.js";

const PORT = Number(process.env.PORT ?? 8787);
const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "pagasa-100", pages: listPages().map((p) => p.number) });
});

app.get("/api/pages", (_req, res) => {
  res.json({ pages: listPages() });
});

app.get("/api/contacts", (_req, res) => {
  res.json(getContacts());
});

app.get("/api/page/:number", (req, res) => {
  const number = req.params.number;
  if (!/^[0-9]{3}$/.test(number)) {
    res.status(400).json({ error: "Page number must be 3 digits", number });
    return;
  }
  const page = getPage(number);
  if (!page) {
    res.status(404).json({ error: "Page not found", number });
    return;
  }
  res.set("Cache-Control", "public, max-age=15");
  res.json(page);
});

app.listen(PORT, () => {
  console.log(`PAGASA-100 API on http://127.0.0.1:${PORT}`);
});
