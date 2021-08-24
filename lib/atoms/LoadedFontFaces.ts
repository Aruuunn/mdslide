import { atom } from "jotai";

export const loadedFontFamiliesAtom = atom<Set<string>>(new Set<string>());

export const fontFaceTextsAtom = atom<string>("");
