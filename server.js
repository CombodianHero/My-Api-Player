import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/apiplayer", (req, res) => {
  const videoUrl = req.query.url;
  const logo = req.query.logo || "/public/logo.png";

  if (!videoUrl) return res.send("Missing video URL");

  res.sendFile(path.join(__dirname, "public/player.html"));
});

app.get("/config", (req, res) => {
  res.json({
    url: req.query.url,
    logo: req.query.logo || "/public/logo.png"
  });
});

app.listen(3000, () =>
  console.log("✅ Player running → http://localhost:3000/apiplayer")
);
