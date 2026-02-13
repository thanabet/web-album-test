import { SPREADS, MAX_SPREAD } from "./config.js";
import { renderSpread } from "./render.js";

function wait(ms){
  return new Promise(r => setTimeout(r, ms));
}

export async function flipNextB(ctx){
  const { state } = ctx;
  if (state.mode !== "OPEN") return;

  // if last spread -> close to back
  if (state.spreadIndex >= MAX_SPREAD){
    // close to back cover
    state.mode = "BACK_CLOSED";
    ctx.renderAll();
    return;
  }

  const fromIndex = state.spreadIndex;
  const toIndex = fromIndex + 1;

  await runFlip(ctx, "next", fromIndex, toIndex);

  state.spreadIndex = toIndex;
  ctx.renderAll();
}

export async function flipPrevB(ctx){
  const { state } = ctx;

  // if back closed -> reopen to last spread
  if (state.mode === "BACK_CLOSED"){
    state.mode = "OPEN";
    state.spreadIndex = MAX_SPREAD;
    ctx.renderAll();
    return;
  }

  if (state.mode !== "OPEN") return;

  const fromIndex = state.spreadIndex;
  if (fromIndex <= 0){
    // close to front
    state.mode = "CLOSED";
    ctx.renderAll();
    return;
  }

  const toIndex = fromIndex - 1;
  await runFlip(ctx, "prev", fromIndex, toIndex);

  state.spreadIndex = toIndex;
  ctx.renderAll();
}

async function runFlip(ctx, dir, fromIndex, toIndex){
  const { els, config } = ctx;
  const layer = els.flipLayer;
  layer.innerHTML = "";
  layer.classList.add("is-on");

  // Build a flip scene
  const scene = document.createElement("div");
  scene.className = "flip-scene";
  layer.appendChild(scene);

  // Under pages (target spread rendered underneath)
  const underL = document.createElement("div");
  const underR = document.createElement("div");
  underL.className = "flip-under";
  underR.className = "flip-under";
  scene.appendChild(underL);
  scene.appendChild(underR);

  // Create temp bg/content holders to reuse renderSpread
  const tmpLeftBg = document.createElement("div");
  const tmpRightBg = document.createElement("div");
  const tmpLeft = document.createElement("div");
  const tmpRight = document.createElement("div");

  tmpLeftBg.style.position = "absolute";
  tmpLeftBg.style.inset = "0";
  tmpRightBg.style.position = "absolute";
  tmpRightBg.style.inset = "0";
  tmpLeft.style.position = "absolute";
  tmpLeft.style.inset = "0";
  tmpRight.style.position = "absolute";
  tmpRight.style.inset = "0";

  underL.appendChild(tmpLeftBg);
  underL.appendChild(tmpLeft);
  underR.appendChild(tmpRightBg);
  underR.appendChild(tmpRight);

  // Render TO spread underneath (so it appears when sheet flips away)
  renderSpread({
    spreadIndex: toIndex,
    leftBgEl: tmpLeftBg,
    rightBgEl: tmpRightBg,
    leftEl: tmpLeft,
    rightEl: tmpRight,
    config
  });

  // Flipping sheet contains FROM side content (the page being turned)
  const sheet = document.createElement("div");
  sheet.className = `flip-sheet ${dir === "next" ? "right" : "left"}`;
  layer.appendChild(sheet);

  // Build faces
  const faceFront = document.createElement("div");
  faceFront.className = "sheet-face sheet-front";
  const faceBack = document.createElement("div");
  faceBack.className = "sheet-face sheet-back";

  // shadow
  const shadow = document.createElement("div");
  shadow.className = "sheet-shadow";

  faceFront.appendChild(shadow);
  sheet.appendChild(faceFront);
  sheet.appendChild(faceBack);

  // linked dim on opposite side
  const dim = document.createElement("div");
  dim.className = "linked-dim";
  layer.appendChild(dim);

  // Render FROM spread on the flipping face (only the turning page side)
  const fromSpread = SPREADS[fromIndex];

  // Helper to render a single side by rendering the whole spread then picking side HTML
  const tmp2LeftBg = document.createElement("div");
  const tmp2RightBg = document.createElement("div");
  const tmp2Left = document.createElement("div");
  const tmp2Right = document.createElement("div");

  renderSpread({
    spreadIndex: fromIndex,
    leftBgEl: tmp2LeftBg,
    rightBgEl: tmp2RightBg,
    leftEl: tmp2Left,
    rightEl: tmp2Right,
    config
  });

  const turningIsRight = dir === "next";

  // Put correct “page” into faceFront (visible at start)
  if (turningIsRight){
    faceFront.appendChild(clonePageVisual(tmp2RightBg, tmp2Right));
    // backface: simple paper backside (can replace later)
    faceBack.appendChild(makeBackFace());
    // dim left page during flip
    dim.classList.add("dim");
    dim.style.left = "0";
    dim.style.width = "50%";
  } else {
    faceFront.appendChild(clonePageVisual(tmp2LeftBg, tmp2Left));
    faceBack.appendChild(makeBackFace());
    dim.classList.add("dim");
    dim.style.left = "50%";
    dim.style.width = "50%";
  }

  // Animate
  sheet.style.transition = `transform var(--flip-ms) cubic-bezier(.2,.9,.2,1)`;
  shadow.style.transition = `opacity var(--flip-ms) ease`;

  // start
  sheet.style.transform = "rotateY(0deg)";
  shadow.style.opacity = "0";

  await wait(20);

  // mid shadow on
  shadow.style.opacity = "1";

  // end rotation
  sheet.style.transform = turningIsRight ? "rotateY(-180deg)" : "rotateY(180deg)";

  // wait animation end
  const ms = getComputedStyle(document.documentElement).getPropertyValue("--flip-ms");
  const dur = parseInt(ms.trim().replace("ms",""), 10) || 650;
  await wait(dur + 30);

  // cleanup
  layer.classList.remove("is-on");
  layer.innerHTML = "";
}

function clonePageVisual(bgEl, contentEl){
  const wrap = document.createElement("div");
  wrap.style.position = "absolute";
  wrap.style.inset = "0";
  wrap.style.borderRadius = "18px";
  wrap.style.overflow = "hidden";

  const bg = bgEl.cloneNode(true);
  bg.style.position = "absolute";
  bg.style.inset = "0";

  const content = contentEl.cloneNode(true);
  content.style.position = "absolute";
  content.style.inset = "0";

  wrap.appendChild(bg);
  wrap.appendChild(content);
  return wrap;
}

function makeBackFace(){
  const back = document.createElement("div");
  back.style.position = "absolute";
  back.style.inset = "0";
  back.style.background =
    "radial-gradient(340px 220px at 30% 25%, rgba(255,255,255,.16), rgba(0,0,0,0) 60%)," +
    "linear-gradient(180deg, #f1e6cf, #e6d7b7)";
  back.style.borderRadius = "18px";
  back.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,.06)";
  return back;
}
