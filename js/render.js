const SPREAD_LABELS = [
  { left: "inside_front", right: "photo_01" },
  { left: "photo_02", right: "photo_03" },
  { left: "photo_04", right: "photo_05" },
  { left: "photo_06", right: "inside_back" },
  { left: "back_cover", right: "table_visible" } // last concept
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

  // current spread labels (when open)
  const pair = SPREAD_LABELS[state.spreadIndex] || SPREAD_LABELS[0];
  els.leftLabel.textContent = pair.left;
  els.rightLabel.textContent = pair.right;

  // cover visuals for front/back closed
  if (!state.isOpen && state.pose === "BACK_CLOSED_CENTER") {
    els.coverBook.classList.remove("book-front");
    els.coverBook.classList.add("book-back");
    els.coverTitleBrand.textContent = "Intromie";
    els.coverTitleName.textContent = "Back Cover";
    els.coverTitleHint.textContent = "Tap to open";
  } else {
    els.coverBook.classList.remove("book-back");
    els.coverBook.classList.add("book-front");
    els.coverTitleBrand.textContent = "Intromie";
    els.coverTitleName.textContent = "Photo Album";
    els.coverTitleHint.textContent = "Tap to open";
  }

  // optional hud
  if (els.hud && els.hud.dataset.on === "1") {
    els.hud.style.display = "block";
    els.hud.textContent = `${state.pose} | open=${state.isOpen} | spread=${state.spreadIndex}`;
  }
}
