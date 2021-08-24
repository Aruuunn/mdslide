import { FC, useEffect } from "react";
import Head from "next/head";
import { useAtom } from "jotai";
import {
  fontFaceTextsAtom,
  loadedFontFamiliesAtom,
} from "lib/atoms/LoadedFontFaces";

export interface LoadFontsProps {
  fontFamilies: string[];
}

export const fetchFontFace = (fontFamilies: string[]): Promise<string> =>
  fetch(
    `https://fonts.googleapis.com/css?family=${fontFamilies
      .map((f) => f + ":regular")
      .join("|")}`
  ).then((r) => r.text());

export const LoadFonts: FC<LoadFontsProps> = (props) => {
  const { fontFamilies: fontFamilesProps } = props;

  const [fontFamiles] = useAtom(loadedFontFamiliesAtom);
  const [fontFaceText, setFontFaceText] = useAtom(fontFaceTextsAtom);

  const loadFonts = (fontFamiles: string[]) => {
    if (fontFamiles.length === 0) return;

    fetchFontFace(fontFamiles)
      .then((fontFace) => setFontFaceText((f) => f + "\n" + fontFace))
      .catch((e) => console.error("Failed to fetch font faces: ", e));
  };

  useEffect(() => {
    console.log(fontFamilesProps);
    const notLoadedFontFamilies: string[] = [];

    for (const fontFamily of fontFamilesProps.map((s) => s.trim())) {
      if (!fontFamiles.has(fontFamily)) {
        fontFamiles.add(fontFamily);
        notLoadedFontFamilies.push(fontFamily);
      }
    }

    loadFonts(notLoadedFontFamilies);
  }, [fontFamilesProps]);

  return (
    <>
      <Head>
        <style id="font-families">{fontFaceText}</style>
      </Head>
    </>
  );
};

export default LoadFonts;
