import { useState, useEffect } from "react";
import Head from "next/head";
import debounce from "debounce";
import { Grid, GridItem } from "@chakra-ui/react";

import {
  EditorPanel,
  Navbar,
  PreviewSpace,
  SlideNavigator,
} from "../components";

interface Slide {
  bgColor: string;
  fontColor: string;
  mdContent: string;
}

export default function Home() {
  const defaultSlideValue: Slide = {
    fontColor: "black",
    bgColor: "white",
    mdContent: "",
  };

  const [state, setState] = useState<{ currentSlide: number; slides: Slide[] }>(
    { currentSlide: 0, slides: [{ ...defaultSlideValue }] }
  );

  const updateCurrentSlide = (map: (slide: Slide) => Slide) => {
    setState((s) => ({
      ...s,
      slides: [
        ...s.slides.slice(0, s.currentSlide),
        map(s.slides[s.currentSlide]),
        ...s.slides.slice(s.currentSlide + 1),
      ],
    }));
  };

  const getCurrentSlide = (): Slide => state.slides[state.currentSlide];

  const goToSlide = (idx: number) => {
    setState((s) => ({
      ...s,
      currentSlide: idx,
    }));
  };

  const nextSlide = () => {
    setState((s) => ({
      ...s,
      currentSlide:
        s.slides.length !== s.currentSlide + 1
          ? s.currentSlide + 1
          : s.currentSlide,
    }));
  };

  const prevSlide = () => {
    setState((s) => ({
      ...s,
      currentSlide: s.currentSlide !== 0 ? s.currentSlide - 1 : s.currentSlide,
    }));
  };

  useEffect(() => {
    window.onkeydown = (e) => {
      if (e.keyCode == 37) {
        prevSlide();
      } else if (e.keyCode == 39) {
        nextSlide();
      }
    };
  }, []);

  return (
    <div>
      <Head>
        <title>MSLIDE</title>
      </Head>
      <Navbar />
      <Grid
        height={"calc(100vh - 70px)"}
        templateRows="repeat(12, 1fr)"
        templateColumns="repeat(3, 1fr)"
        as="main"
      >
        <GridItem rowSpan={12} colSpan={1}>
          <EditorPanel
            value={getCurrentSlide().mdContent}
            bgColor={getCurrentSlide().bgColor}
            setBgColor={debounce(
              (value: string) =>
                updateCurrentSlide((s) => ({
                  ...s,
                  bgColor: value,
                })),
              200
            )}
            fontColor={getCurrentSlide().fontColor}
            setFontColor={debounce(
              (value: string) =>
                updateCurrentSlide((s) => ({
                  ...s,
                  fontColor: value,
                })),
              200
            )}
            setValue={(value) =>
              updateCurrentSlide((s) => ({
                ...s,
                mdContent: value,
              }))
            }
          />
        </GridItem>
        <GridItem rowSpan={11} colSpan={2}>
          <PreviewSpace
            bgColor={getCurrentSlide().bgColor}
            fontColor={getCurrentSlide().fontColor}
            mdContent={getCurrentSlide().mdContent}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <SlideNavigator
            onAddNewSlide={() => {
              setState((s) => ({
                ...s,
                currentSlide: s.currentSlide + 1,
                slides: [...s.slides, { ...defaultSlideValue }],
              }));
            }}
            currentSlide={state.currentSlide}
            onClickSlide={goToSlide}
            slides={state.slides}
          />
        </GridItem>
      </Grid>
    </div>
  );
}
