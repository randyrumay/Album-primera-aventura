const pages = [...document.querySelectorAll(".page")];
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const counter = document.getElementById("counter");
const musicBtn = document.getElementById("music");
const audio = document.getElementById("bgMusic");
const openBtn = document.getElementById("openAlbum");
let current = 0;
let started = false;

function showPage(n, direction=1) {
  if (n < 0 || n >= pages.length) return;
  pages[current].classList.remove("active");
  current = n;
  pages[current].classList.add("active");
  counter.textContent = `${current + 1} / ${pages.length}`;
  prev.style.visibility = current === 0 ? "hidden" : "visible";
  next.style.visibility = current === pages.length - 1 ? "hidden" : "visible";
}

function startMusic() {
  if (started) return;
  started = true;
  audio.volume = 0.38;
  audio.play().then(() => musicBtn.classList.add("playing")).catch(() => {});
}

openBtn.addEventListener("click", () => { startMusic(); showPage(1); });
next.addEventListener("click", () => { startMusic(); showPage(current + 1, 1); });
prev.addEventListener("click", () => showPage(current - 1, -1));

musicBtn.addEventListener("click", async () => {
  if (audio.paused) {
    try { await audio.play(); musicBtn.classList.add("playing"); }
    catch(e) {}
  } else {
    audio.pause();
    musicBtn.classList.remove("playing");
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next.click(); }
  if (e.key === "ArrowLeft") prev.click();
});

let startX = null;
let startY = null;
document.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].clientX;
  startY = e.changedTouches[0].clientY;
}, {passive:true});
document.addEventListener("touchend", e => {
  if (startX === null) return;
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.15) {
    if (dx < 0) next.click(); else prev.click();
  }
  startX = startY = null;
});

showPage(0);
