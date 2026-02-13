const SPREADS = [
  { left: { type: "inside", key: "inside_front" }, right: { type: "photo", key: "photo_01" } },
  { left: { type: "photo", key: "photo_02" },     right: { type: "photo", key: "photo_03" } },
  { left: { type: "photo", key: "photo_04" },     right: { type: "photo", key: "photo_05" } },
  { left: { type: "photo", key: "photo_06" },     right: { type: "inside", key: "inside_back" } }
];

// Placeholder asset paths (you will replace later)
const ASSETS = {
  inside_front: "./assets/inner_covers/inside_front.png",
  inside_back:  "./assets/inner_covers/inside_back.png",
  plastic:      "./assets/plastic/plastic_01.png"
};

// Photo placeholders (later these will be real uploaded URLs)
function placeholderPhotoSrc(key){
  // simple SVG data URI so we don't need real images now
  const text = encodeURIComponent(key);
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d9d9d9"/>
        <stop offset="1" stop-color="#bdbdbd"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-size="44" font-family="Arial" fill="#333" text-anchor="middle">${text}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

export function render(state, els) {
  // pose
  els.album.classList.remove("pose-closed","pose-open","pose-back");
  if (state.pose === "CLOSED") els.album.classList.add("pose-closed");
  if (state.pose === "OPEN") els.album.classList.add("pose-open");
  if (state.pose === "BACK_CLOSED") els.album.classList.add("pose-back");

  // open/close visibility
  if (state.isOpen) els.album.classList.add("is-open");
  else els.album.classList.remove("is-open");

  // cover front/back
  if (!state.isOpen && state.pose === "BACK_CLOSED") {
    els.book.classList.remove("book-front");
    els.book.classList.add("book-back");
    els.coverTitleName.textContent = "Back Cover";
  } else {
    els.book.classList.remove("book-back");
    els.book.classList.add("book-front");
    els.coverTitleName.textContent = "Photo Album";
  }

  // open spreads rendering
  if (state.isOpen) {
    const spread = SPREADS[state.spreadIndex] || SPREADS[0];
    els.leftContent.innerHTML = renderCell(spread.left);
    els.rightContent.innerHTML = renderCell(spread.right);

    // apply random rotation per slot (stable per spread+side)
    applySlotTransforms(els.leftContent,  `L-${state.spreadIndex}`);
    applySlotTransforms(els.rightContent, `R-${state.spreadIndex}`);
  }

  // optional HUD
  if (els.hud && els.hud.dataset.on === "1") {
    els.hud.style.display = "block";
    els.hud.textContent = `${state.pose} | open=${state.isOpen} | spread=${state.spreadIndex}`;
  }
}

function renderCell(cell){
  if (cell.type === "inside") {
    const src = ASSETS[cell.key];
    return `
      <div class="inside-cover">
        <img src="${src}" alt="">
      </div>
    `;
  }

  // photo slot with back photo peek + plastic overlay
  const photoSrc = placeholderPhotoSrc(cell.key);
  const plasticSrc = ASSETS.plastic;

  return `
    <div class="photo-slot" data-slot="${cell.key}">
      <div class="photo-back"></div>
      <div class="photo-main">
        <img class="photo" src="${photoSrc}" alt="">
      </div>
      <img class="plastic" src="${plasticSrc}" alt="">
      <div class="slot-label">${cell.key}</div>
    </div>
  `;
}

function hashToRange01(str){
  // tiny deterministic hash -> 0..1
  let h = 2166136261;
  for (let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000; // 0..0.999
}

function applySlotTransforms(container, seed){
  const slot = container.querySelector(".photo-slot");
  if (!slot) return;

  // rotation: -0.8..+0.8 deg
  const r = (hashToRange01(seed) * 1.6) - 0.8;

  // tiny offset for realism
  const ox = (hashToRange01(seed+"x") * 6) - 3; // -3..+3 px
  const oy = (hashToRange01(seed+"y") * 6) - 3;

  // apply to main+plastic as a group (but keep back peek aligned)
  const main = container.querySelector(".photo-main");
  const plastic = container.querySelector(".plastic");
  if (main) main.style.transform = `translate(${ox}px, ${oy}px) rotate(${r}deg)`;
  if (plastic) plastic.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) rotate(${r}deg)`;
}
