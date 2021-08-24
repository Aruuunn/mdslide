import { FC, useEffect, useRef, useState } from "react";
import Head from "next/head";

export interface LoadFontsProps {
  fontFamilies: string[];
}

export const LoadFonts: FC<LoadFontsProps> = (props) => {
  const { fontFamilies: fontFamilesProps } = props;

  const fontFamiles = useRef(new Set<string>());
  const [fontFaceText, setFontFaceText] = useState("");

  const fetchFontFace = (fontFamilies: string[]): Promise<string> =>
    fetch(
      `https://fonts.googleapis.com/css?family=${fontFamilies
        .map((f) => f + ":regular")
        .join("|")}`
    ).then((r) => r.text());

  const loadFonts = (fontFamiles: string[]) => {
    if (fontFamiles.length === 0) return;

    fetchFontFace(fontFamiles)
      .then((fontFace) => setFontFaceText((f) => f + "\n" + fontFace))
      .catch((e) => console.error("Failed to fetch font faces: ", e));
  };

  useEffect(() => {
    const notLoadedFontFamilies: string[] = [];

    for (const fontFamily of fontFamilesProps.map((s) => s.trim())) {
      if (!fontFamiles.current.has(fontFamily)) {
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
