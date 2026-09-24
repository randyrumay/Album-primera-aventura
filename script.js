const cover = document.getElementById("cover");
const album = document.getElementById("album");
const pages = [...document.querySelectorAll(".page")];
const pageNumber = document.getElementById("pageNumber");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dots = document.getElementById("dots");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const openAlbum = document.getElementById("openAlbum");

let current = 0;
let touchStartX = 0;
let touchStartY = 0;

pages.forEach((_, i) => {
  const d = document.createElement("span");
  d.className = "dot";
  d.addEventListener("click", () => showPage(i));
  dots.appendChild(d);
});

function showPage(index) {
  current = Math.max(0, Math.min(index, pages.length - 1));
  pages.forEach((p, i) => p.classList.toggle("active", i === current));
  pageNumber.textContent = current + 1;
  [...dots.children].forEach((d, i) => d.classList.toggle("active", i === current));
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
  prevBtn.style.opacity = current === 0 ? ".45" : "1";
  nextBtn.style.opacity = current === pages.length - 1 ? ".45" : "1";
  window.scrollTo({top: 0, behavior: "smooth"});
}

function nextPage(){ if(current < pages.length - 1) showPage(current + 1); }
function prevPage(){ if(current > 0) showPage(current - 1); }

openAlbum.addEventListener("click", async () => {
  cover.classList.add("hidden");
  album.classList.remove("hidden");
  showPage(0);
  try {
    await bgMusic.play();
    musicBtn.textContent = "❚❚";
  } catch(e) {
    musicBtn.textContent = "♪";
  }
});

nextBtn.addEventListener("click", nextPage);
prevBtn.addEventListener("click", prevPage);

musicBtn.addEventListener("click", async () => {
  if (bgMusic.paused) {
    try { await bgMusic.play(); musicBtn.textContent = "❚❚"; }
    catch(e) {}
  } else {
    bgMusic.pause();
    musicBtn.textContent = "♪";
  }
});

document.addEventListener("keydown", e => {
  if (album.classList.contains("hidden")) return;
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "ArrowLeft") prevPage();
});

album.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, {passive:true});

album.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextPage();
    else prevPage();
  }
}, {passive:true});

showPage(0);
