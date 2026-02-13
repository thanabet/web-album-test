import { createState, openAlbum, next, prev, closeToFront } from "./state.js";
import { render } from "./render.js";

const state = createState();

const els = {
  album: document.getElementById("album"),
  coverBtn: document.getElementById("coverBtn"),
  book: document.getElementById("book"),
  coverTitleName: document.querySelector(".cover-title .name"),
  openWrap: document.getElementById("openWrap"),
  leftContent: document.getElementById("leftContent"),
  rightContent: document.getElementById("rightContent"),
  tapLeft: document.getElementById("tapLeft"),
  tapRight: document.getElementById("tapRight"),
  hud: document.getElementById("hud")
};

// Debug HUD optional
// els.hud.dataset.on = "1";

function rerender(){ render(state, els); }

// Tap cover
els.coverBtn.addEventListener("click", () => {
  if (state.isOpen) closeToFront(state);
  else openAlbum(state);
  rerender();
});

// Tap zones
els.tapRight.addEventListener("click", () => { next(state); rerender(); });
els.tapLeft.addEventListener("click", () => { prev(state); rerender(); });

// Swipe (light)
let startX = null;
document.addEventListener("touchstart", (e) => {
  if (!e.touches?.length) return;
  startX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const endX = e.changedTouches?.[0]?.clientX ?? startX;
  const dx = endX - startX;
  startX = null;

  if (Math.abs(dx) < 35) return;
  if (dx < 0) next(state);
  else prev(state);
  rerender();
}, { passive: true });

rerender();
