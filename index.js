import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const MCP_URL = "https://questathon.aihackerscollective.com/api/public/mcp";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const STORE_FILE = path.join(HERE, "store.json");
let lastCall = 0;
let busy = false;

async function loadStore() {
  try {
    return JSON.parse(await fs.readFile(STORE_FILE, "utf8"));
  } catch {
    return { data: {}, notes: [], lastError: null };
  }
}
async function saveStore(store) {
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), "utf8");
}
async function callMcp(toolName, args = {}) {
  const token = process.env.AQ_TOKEN;
  if (!token || token.includes("PASTE_YOUR")) {
    throw new Error("Token is not configured. Put your private token in the .env file.");
  }
  const remaining = 60000 - (Date.now() - lastCall);
  if (remaining > 0) {
    throw new Error(`Please wait ${Math.ceil(remaining / 1000)} seconds before the next call.`);
  }
  lastCall = Date.now();

  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json, text/event-stream",
      "authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: toolName, arguments: args }
    })
  });

  const body = await response.text();
  if (!response.ok) throw new Error(`Questathon returned HTTP ${response.status}.`);
  const packet = JSON.parse(body);
  if (packet.error || packet.result?.isError) {
    throw new Error(packet.error?.message || packet.result?.content?.[0]?.text || "Questathon tool error.");
  }
  const textPart = packet.result?.content?.find(part => part.type === "text")?.text;
  if (textPart) {
    try { return JSON.parse(textPart); } catch { return textPart; }
  }
  return packet.result ?? packet;
}

app.get("/api/status", async (_req, res) => {
  const store = await loadStore();
  res.json({
    configured: Boolean(process.env.AQ_TOKEN && !process.env.AQ_TOKEN.includes("PASTE_YOUR")),
    data: store.data,
    notes: store.notes,
    lastError: store.lastError
  });
});

app.post("/api/sync", async (req, res) => {
  if (busy) return res.status(429).json({ error: "A request is already running." });
  const name = req.body?.name;
  const allowed = [
    "whoami", "get_my_accounts", "get_signals", "get_feature_requests",
    "get_release_notes", "get_flytbase_team", "get_data_format", "list_notes"
  ];
  if (!allowed.includes(name)) return res.status(400).json({ error: "Unknown tool." });

  busy = true;
  try {
    const value = await callMcp(name);
    const store = await loadStore();
    store.data[name] = { value, fetchedAt: new Date().toISOString() };
    store.lastError = null;
    await saveStore(store);
    res.json({ ok: true, value });
  } catch (error) {
    const store = await loadStore();
    store.lastError = error.message;
    await saveStore(store);
    res.status(400).json({ error: error.message });
  } finally {
    busy = false;
  }
});

app.post("/api/notes", async (req, res) => {
  if (busy) return res.status(429).json({ error: "A request is already running." });
  const { text, account = "", kind = "next_step", title = "" } = req.body ?? {};
  if (!text || !String(text).trim()) return res.status(400).json({ error: "Enter a note first." });

  busy = true;
  try {
    const result = await callMcp("write_note", { text: String(text), account, kind, title });
    const store = await loadStore();
    store.notes.push({ text, account, kind, title, savedAt: new Date().toISOString() });
    store.lastError = null;
    await saveStore(store);
    res.json({ ok: true, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    busy = false;
  }
});

app.listen(PORT, () => {
  console.log(`Questathon CRM server is running on http://localhost:${PORT}`);
});