import { MAX_SPREAD } from "./config.js";

export function createState(){
  return {
    mode: "CLOSED",     // CLOSED | OPEN | BACK_CLOSED
    spreadIndex: 0
  };
}

export function openAlbum(s){
  s.mode = "OPEN";
  s.spreadIndex = 0;
}

export function closeFront(s){
  s.mode = "CLOSED";
  s.spreadIndex = 0;
}

export function closeBack(s){
  s.mode = "BACK_CLOSED";
  s.spreadIndex = MAX_SPREAD;
}

export function canNext(s){
  return s.mode === "OPEN";
}
export function canPrev(s){
  return s.mode === "OPEN" || s.mode === "BACK_CLOSED";
}
