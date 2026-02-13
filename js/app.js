import {
  createState, openAlbum, nextSpread, prevSpread, closeToFront
} from "./state.js";
import { render } from "./render.js";

const state = createState();

const els = {
  albumWrap: document.getElementById("albumWrap"),
  coverBtn: document.getElementById("coverBtn"),
  spread: document.getElementById("spread"),
  tapLeft: document.getElementById("tapLeft"),
  tapRight: document.getElementById("tapRight"),
  leftLabel: document.getElementById("leftLabel"),
  rightLabel: document.getElementById("rightLabel"),
  hud: document.getElementById("hud"),
  coverFace: document.querySelector(".cover-face.front"),
  coverTitleBrand: document.querySelector(".cover-title .brand"),
  coverTitleName: document.querySelector(".cover-title .name"),
  coverTitleHint: document.querySelector(".cover-title .hint")
};

// Toggle this if you want debug HUD
// els.hud.dataset.on = "1";

function rerender() { render(state, els); }

// Tap cover
els.coverBtn.addEventListener("click", () => {
  // If already open, close to front (not used in M1, but handy)
  if (state.isOpen) {
    closeToFront(state);
  } else {
    openAlbum(state);
  }
  rerender();
});

// Tap left/right (only active when open; functions already guard)
els.tapRight.addEventListener("click", () => { nextSpread(state); rerender(); });
els.tapLeft.addEventListener("click", () => { prevSpread(state); rerender(); });

// Bonus: swipe support (super light)
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

  // small threshold
  if (Math.abs(dx) < 35) return;

  if (dx < 0) nextSpread(state);   // swipe left -> next
  else prevSpread(state);          // swipe right -> prev
  rerender();
}, { passive: true });

// Initial render
rerender();
