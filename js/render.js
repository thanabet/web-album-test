const SPREAD_LABELS = [
  { left: "inside_front", right: "photo_01" },
  { left: "photo_02", right: "photo_03" },
  { left: "photo_04", right: "photo_05" },
  { left: "photo_06", right: "inside_back" },
  { left: "back_cover", right: "table_visible" } // (won't be shown as spread; back is closed pose)
];

export function render(state, els) {
  // pose classes
  els.albumWrap.classList.remove("pose-closed", "pose-open", "pose-back");
  if (state.pose === "CLOSED_CENTER") els.albumWrap.classList.add("pose-closed");
  if (state.pose === "OPEN_CENTER") els.albumWrap.classList.add("pose-open");
  if (state.pose === "BACK_CLOSED_CENTER") els.albumWrap.classList.add("pose-back");

  // open/close
  if (state.isOpen) els.albumWrap.classList.add("is-open");
  else els.albumWrap.classList.remove("is-open");

  // labels for current spread (when open)
  const pair = SPREAD_LABELS[state.spreadIndex] || SPREAD_LABELS[0];
  els.leftLabel.textContent = pair.left;
  els.rightLabel.textContent = pair.right;

  // cover visual tweak for back cover state (placeholder)
  if (!state.isOpen && state.pose === "BACK_CLOSED_CENTER") {
    els.coverTitleBrand.textContent = "Intromie";
    els.coverTitleName.textContent = "Back Cover";
    els.coverTitleHint.textContent = "Tap to open";
    els.coverFace.classList.add("is-back");
    els.coverFace.style.background =
      "radial-gradient(120px 120px at 25% 20%, rgba(255,255,255,.10), rgba(0,0,0,0) 65%)," +
      "repeating-linear-gradient(25deg, rgba(255,255,255,.05) 0px, rgba(255,255,255,.05) 6px, rgba(0,0,0,0) 6px, rgba(0,0,0,0) 12px)," +
      "linear-gradient(180deg, #1e3b55, #0d2233)";
  } else {
    els.coverTitleBrand.textContent = "Intromie";
    els.coverTitleName.textContent = "Photo Album";
    els.coverTitleHint.textContent = "Tap to open";
    els.coverFace.classList.remove("is-back");
    els.coverFace.style.background = ""; // fallback to CSS default
  }

  // optional hud
  if (els.hud && els.hud.dataset.on === "1") {
    els.hud.style.display = "block";
    els.hud.textContent = `${state.pose} | open=${state.isOpen} | spread=${state.spreadIndex}`;
  }
}
