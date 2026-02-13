import { DEFAULTS } from "./config.js";

export const paths = {
  table: (file) => `./assets/table_styles/${file}`,
  coverFront: (file) => `./assets/cover_styles/front/${file}`,
  coverBack: (file) => `./assets/cover_styles/back/${file}`,
  inner: (file) => `./assets/inner_covers/${file}`,
  plastic: (file) => `./assets/plastic/${file}`,
  spine: (file) => `./assets/spine/${file}`,
  placeholderSvg: () => `./assets/placeholders/photo_placeholder.svg`,
};

export const ASSET_KEYS = {
  inside_front: () => paths.inner(DEFAULTS.insideFront),
  inside_back:  () => paths.inner(DEFAULTS.insideBack),
  plastic:      () => paths.plastic(DEFAULTS.plastic),
  spine:        () => paths.spine(DEFAULTS.spine),
};

export function photoPlaceholderUrl(label){
  // inline svg fallback if placeholder file missing (still works)
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1350">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dedede"/>
        <stop offset="1" stop-color="#bfbfbf"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-size="48" font-family="Arial" fill="#333" text-anchor="middle">${label}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
