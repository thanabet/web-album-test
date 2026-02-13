export function createState() {
  return {
    pose: "CLOSED",      // CLOSED | OPEN | BACK_CLOSED
    spreadIndex: 0,      // 0..3 (open spreads), back cover is special state
    isOpen: false
  };
}

/**
 * Spreads (OPEN):
 * 0: inside_front | photo_01
 * 1: photo_02     | photo_03
 * 2: photo_04     | photo_05
 * 3: photo_06     | inside_back
 *
 * BACK_CLOSED (CLOSED):
 * back_cover shown
 */
export const MAX_OPEN_SPREAD = 3;

export function openAlbum(state) {
  state.isOpen = true;
  state.pose = "OPEN";
  state.spreadIndex = 0;
}

export function closeToFront(state) {
  state.isOpen = false;
  state.pose = "CLOSED";
  state.spreadIndex = 0;
}

export function closeToBack(state) {
  state.isOpen = false;
  state.pose = "BACK_CLOSED";
  state.spreadIndex = MAX_OPEN_SPREAD;
}

export function next(state) {
  if (!state.isOpen) return;
  if (state.spreadIndex < MAX_OPEN_SPREAD) state.spreadIndex += 1;
  else closeToBack(state);
}

export function prev(state) {
  if (!state.isOpen) {
    if (state.pose === "BACK_CLOSED") {
      state.isOpen = true;
      state.pose = "OPEN";
      state.spreadIndex = MAX_OPEN_SPREAD;
    }
    return;
  }
  if (state.spreadIndex > 0) state.spreadIndex -= 1;
  else closeToFront(state);
}
