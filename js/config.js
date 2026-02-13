export const TABLE_STYLES = [
  "table_01.jpg","table_02.jpg","table_03.jpg","table_04.jpg","table_05.jpg","table_06.jpg"
];

export const COVER_FRONT_STYLES = [
  "cover_front_01.jpg","cover_front_02.jpg","cover_front_03.jpg","cover_front_04.jpg","cover_front_05.jpg","cover_front_06.jpg"
];

export const COVER_BACK_STYLES = [
  "cover_back_01.jpg","cover_back_02.jpg","cover_back_03.jpg","cover_back_04.jpg","cover_back_05.jpg","cover_back_06.jpg"
];

export const DEFAULTS = {
  tableStyle: "table_01.jpg",
  coverFrontStyle: "cover_front_01.jpg",
  coverBackStyle: "cover_back_01.jpg",
  plastic: "plastic_01.png",
  spine: "spine_01.png",
  insideFront: "inside_front.png",
  insideBack: "inside_back.png"
};

/**
 * Spreads (6 photos):
 * 0: inside_front | photo_01
 * 1: photo_02     | photo_03
 * 2: photo_04     | photo_05
 * 3: photo_06     | inside_back
 */
export const SPREADS = [
  { left: {type:"inside", key:"inside_front"}, right: {type:"photo", key:"photo_01"} },
  { left: {type:"photo", key:"photo_02"},     right: {type:"photo", key:"photo_03"} },
  { left: {type:"photo", key:"photo_04"},     right: {type:"photo", key:"photo_05"} },
  { left: {type:"photo", key:"photo_06"},     right: {type:"inside", key:"inside_back"} },
];

export const MAX_SPREAD = SPREADS.length - 1;

// small photo tilt range (only photo-front)
export const PHOTO_TILT_DEG = 0.8;
