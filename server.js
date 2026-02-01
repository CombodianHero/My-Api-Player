import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/apiplayer", (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("Missing video url");

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return res.sendFile(path.join(__dirname, "public/player.html"));
  }

  res.sendFile(path.join(__dirname, "public/player.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
