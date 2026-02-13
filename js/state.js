export function createState() {
  return {
    pose: "CLOSED_CENTER",   // CLOSED_CENTER | OPEN_CENTER | BACK_CLOSED_CENTER
    spreadIndex: 0,          // 0..4
    isOpen: false
  };
}

export const MAX_SPREAD = 4;

export function openAlbum(state) {
  state.isOpen = true;
  state.pose = "OPEN_CENTER";
  state.spreadIndex = 0;
}

export function closeToFront(state) {
  state.isOpen = false;
  state.pose = "CLOSED_CENTER";
  state.spreadIndex = 0;
}

export function closeToBack(state) {
  state.isOpen = false;
  state.pose = "BACK_CLOSED_CENTER";
  state.spreadIndex = MAX_SPREAD;
}

export function nextSpread(state) {
  if (!state.isOpen) return;

  if (state.spreadIndex < MAX_SPREAD) {
    state.spreadIndex += 1;
  } else {
    // Past the end -> show back cover closed
    closeToBack(state);
  }
}

export function prevSpread(state) {
  if (!state.isOpen) {
    // If showing back cover closed -> reopen to last spread
    if (state.pose === "BACK_CLOSED_CENTER") {
      state.isOpen = true;
      state.pose = "OPEN_CENTER";
      state.spreadIndex = MAX_SPREAD;
    }
    return;
  }

  if (state.spreadIndex > 0) {
    state.spreadIndex -= 1;
  } else {
    // Back from first spread -> close to front cover
    closeToFront(state);
  }
}
