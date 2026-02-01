const video = document.getElementById("video");
const yt = document.getElementById("yt");
const logo = document.getElementById("logo");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const speedSelect = document.getElementById("speedSelect");
const qualitySelect = document.getElementById("qualitySelect");
const screenshotBtn = document.getElementById("screenshotBtn");

const params = new URLSearchParams(window.location.search);
const url = params.get("url");
const logoUrl = params.get("logo");

logo.src = logoUrl || "/public/logo.png";

let hls = null;

/* 🔍 YouTube detection */
function isYouTube(u) {
  return u.includes("youtube.com") || u.includes("youtu.be");
}

function getYTid(u) {
  if (u.includes("youtu.be")) return u.split("/").pop();
  return new URL(u).searchParams.get("v");
}

/* ▶️ LOAD VIDEO */
if (isYouTube(url)) {
  yt.src = `https://www.youtube.com/embed/${getYTid(url)}?autoplay=1&rel=0`;
  yt.style.display = "block";
} else {
  video.style.display = "block";

  if (url.endsWith(".m3u8") && Hls.isSupported()) {
    hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
      qualitySelect.innerHTML = `<option value="auto">Auto</option>`;
      data.levels.forEach((lvl, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.text = lvl.height + "p";
        qualitySelect.appendChild(opt);
      });
      video.play();
    });
  } else {
    video.src = url;
    video.play();
  }
}

/* ⚙️ SETTINGS TOGGLE */
settingsBtn.onclick = () => {
  settingsPanel.style.display =
    settingsPanel.style.display === "block" ? "none" : "block";
};

/* ⏩ SPEED */
speedSelect.onchange = () => {
  video.playbackRate = parseFloat(speedSelect.value);
};

/* 🎚 QUALITY */
qualitySelect.onchange = () => {
  if (!hls) return;
  if (qualitySelect.value === "auto") {
    hls.currentLevel = -1;
  } else {
    hls.currentLevel = parseInt(qualitySelect.value);
  }
};

/* 📸 SCREENSHOT */
screenshotBtn.onclick = () => {
  if (!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "screenshot.png";
  a.click();
};
