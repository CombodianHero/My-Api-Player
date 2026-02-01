const video = document.getElementById("video");
const speed = document.getElementById("speed");
const speedVal = document.getElementById("speedVal");
const logo = document.getElementById("logo");

const params = new URLSearchParams(window.location.search);
const url = params.get("url");
const logoUrl = params.get("logo");

logo.src = logoUrl || "/public/logo.png";

// HLS / Normal playback
if (url.endsWith(".m3u8")) {
  if (Hls.isSupported()) {
    const hls = new Hls({
      maxBufferLength: 60
    });
    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });

  } else {
    video.src = url;
  }
} else {
  video.src = url;
}

// Speed control
speed.oninput = () => {
  video.playbackRate = speed.value;
  speedVal.innerText = speed.value + "x";
};

// Resume playback
video.addEventListener("timeupdate", () => {
  localStorage.setItem(url, video.currentTime);
});

video.addEventListener("loadedmetadata", () => {
  const last = localStorage.getItem(url);
  if (last) video.currentTime = last;
});

// Picture in Picture
video.addEventListener("dblclick", async () => {
  if (document.pictureInPictureEnabled) {
    await video.requestPictureInPicture();
  }
});
