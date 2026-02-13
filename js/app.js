import { createState, openAlbum, closeFront } from "./state.js";
import { DEFAULTS } from "./config.js";
import { renderStaticStyles, renderState, renderSpread } from "./render.js";
import { flipNextB, flipPrevB } from "./flip.js";

const state = createState();

const config = {
  tableStyle: DEFAULTS.tableStyle,
  coverFrontStyle: DEFAULTS.coverFrontStyle,
  coverBackStyle: DEFAULTS.coverBackStyle,
  plastic: DEFAULTS.plastic
};

const els = {
  world: document.getElementById("world"),
  tableImg: document.getElementById("tableImg"),
  album: document.getElementById("album"),
  coverBtn: document.getElementById("coverBtn"),
  book: document.getElementById("book"),
  coverFrontTex: document.getElementById("coverFrontTex"),
  coverBackTex: document.getElementById("coverBackTex"),

  spread: document.getElementById("spread"),
  pageBgLeft: document.getElementById("pageBgLeft"),
  pageBgRight: document.getElementById("pageBgRight"),
  pageLeft: document.getElementById("pageLeft"),
  pageRight: document.getElementById("pageRight"),

  tapLeft: document.getElementById("tapLeft"),
  tapRight: document.getElementById("tapRight"),

  spineImg: document.getElementById("spineImg"),
  flipLayer: document.getElementById("flipLayer"),
};

function renderAll(){
  renderStaticStyles({
    tableImgEl: els.tableImg,
    coverFrontEl: els.coverFrontTex,
    coverBackEl: els.coverBackTex,
    spineImgEl: els.spineImg,
    config
  });

  renderState({
    state,
    albumEl: els.album,
    spreadEl: els.spread,
    bookEl: els.book
  });

  if (state.mode === "OPEN"){
    renderSpread({
      spreadIndex: state.spreadIndex,
      leftBgEl: els.pageBgLeft,
      rightBgEl: els.pageBgRight,
      leftEl: els.pageLeft,
      rightEl: els.pageRight,
      config
    });
  }
}

const ctx = { state, els, config, renderAll };

els.coverBtn.addEventListener("click", () => {
  if (state.mode === "OPEN") {
    closeFront(state);
  } else {
    openAlbum(state);
  }
  renderAll();
});

els.tapRight.addEventListener("click", async () => {
  await flipNextB(ctx);
});

els.tapLeft.addEventListener("click", async () => {
  await flipPrevB(ctx);
});

// swipe support
let startX = null;
document.addEventListener("touchstart", (e) => {
  if (!e.touches?.length) return;
  startX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", async (e) => {
  if (startX === null) return;
  const endX = e.changedTouches?.[0]?.clientX ?? startX;
  const dx = endX - startX;
  startX = null;

  if (Math.abs(dx) < 35) return;
  if (dx < 0) await flipNextB(ctx);
  else await flipPrevB(ctx);
}, { passive: true });

renderAll();
