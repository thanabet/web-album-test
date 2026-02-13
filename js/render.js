import { SPREADS, DEFAULTS, PHOTO_TILT_DEG } from "./config.js";
import { paths, ASSET_KEYS, photoPlaceholderUrl } from "./assets.js";

function hash01(str){
  let h = 2166136261;
  for (let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function tiltFor(seed){
  // -deg..+deg
  const r = (hash01(seed) * 2 * PHOTO_TILT_DEG) - PHOTO_TILT_DEG;
  return r.toFixed(3);
}

export function renderStaticStyles({ tableImgEl, coverFrontEl, coverBackEl, spineImgEl, config }){
  tableImgEl.style.backgroundImage = `url("${paths.table(config.tableStyle)}")`;
  coverFrontEl.style.backgroundImage = `url("${paths.coverFront(config.coverFrontStyle)}")`;
  coverBackEl.style.backgroundImage = `url("${paths.coverBack(config.coverBackStyle)}")`;
  spineImgEl.src = paths.spine(DEFAULTS.spine);
}

export function renderState({ state, albumEl, spreadEl, bookEl }){
  albumEl.classList.remove("state-closed","state-open","state-back");
  if (state.mode === "CLOSED") albumEl.classList.add("state-closed");
  if (state.mode === "OPEN") albumEl.classList.add("state-open");
  if (state.mode === "BACK_CLOSED") albumEl.classList.add("state-closed"); // visually closed

  // back cover state uses cover-back texture and hides title
  const title = bookEl.querySelector(".cover-text");
  if (state.mode === "BACK_CLOSED"){
    title.style.opacity = "0";
  } else {
    title.style.opacity = "1";
  }

  spreadEl.setAttribute("aria-hidden", state.mode !== "OPEN" ? "true" : "false");
}

export function buildPageCell(cell, seed, plasticUrl){
  if (cell.type === "inside"){
    const src = cell.key === "inside_front" ? ASSET_KEYS.inside_front() : ASSET_KEYS.inside_back();
    // inside cover = full-page image background; no slot
    return `
      <div class="slot" style="width:100%;height:100%;">
        <div class="inside-full" style="
          position:absolute; inset:0;
          background-image:url('${src}');
          background-size:cover;background-position:center;
          border-radius: 18px;
        "></div>
      </div>
    `;
  }

  // photo cell
  const tilt = tiltFor(seed);
  const photoSrc = photoPlaceholderUrl(cell.key);

  return `
    <div class="slot">
      <div class="photo-stack">
        <div class="photo-back"></div>
        <div class="photo-front" style="transform: rotate(${tilt}deg);">
          <img src="${photoSrc}" alt="">
        </div>
        <img class="plastic" src="${plasticUrl}" alt="">
      </div>
    </div>
  `;
}

export function renderSpread({ spreadIndex, leftBgEl, rightBgEl, leftEl, rightEl, config }){
  const spread = SPREADS[spreadIndex] || SPREADS[0];

  // page background in M1: use inside cover images when applicable, else a warm paper board
  const paperFallback = `radial-gradient(360px 240px at 30% 25%, rgba(255,255,255,.18), rgba(0,0,0,0) 60%),
                         linear-gradient(180deg, #efe3c8, #e6d7b7)`;

  // left page background
  if (spread.left.type === "inside"){
    leftBgEl.style.backgroundImage = `url("${ASSET_KEYS.inside_front()}")`;
  } else {
    leftBgEl.style.backgroundImage = paperFallback;
  }

  // right page background
  if (spread.right.type === "inside"){
    rightBgEl.style.backgroundImage = `url("${ASSET_KEYS.inside_back()}")`;
  } else {
    rightBgEl.style.backgroundImage = paperFallback;
  }

  const plasticUrl = paths.plastic(config.plastic);

  leftEl.innerHTML = buildPageCell(spread.left, `L-${spreadIndex}`, plasticUrl);
  rightEl.innerHTML = buildPageCell(spread.right, `R-${spreadIndex}`, plasticUrl);
}
