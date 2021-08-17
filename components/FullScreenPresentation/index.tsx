import { FC, useEffect } from "react";
import { Slide } from "../Slide";
import { Box } from "@chakra-ui/react";
import { useStore } from "lib/stores/EditorPage";

export interface FullScreenPresentationProps {}

export const FullScreenPresentation: FC<FullScreenPresentationProps> = (
  props
) => {
  const store = useStore();
  const currentSlide = store.slides[store.currentSlideIdx];

  useEffect(() => {
    document.body.onfullscreenchange = () => {
      if (document.fullscreenElement !== document.body) {
        store.stopPresentationMode();
      }
    };

    document.body.requestFullscreen();

    window.onkeydown = (e) => {
      switch (e.key) {
        case "Escape":
          store.stopPresentationMode();
          break;
        case "ArrowLeft":
          store.goToPrevSlide();
          break;
        case "ArrowRight":
          store.goToNextSlide();
          break;
      }
    };
  }, []);

  return (
    <Box
      bg={currentSlide.bgColor}
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top="0"
      left="0"
      overflow="hidden"
    >
      <Slide
        constraintSize={{
          width: window.screen.width,
          height: window.screen.height,
        }}
        bgColor={currentSlide.bgColor}
        fontColor={currentSlide.fontColor}
        mdContent={currentSlide.mdContent}
        height={window.screen.height}
        width={window.screen.width}
      />
    </Box>
  );
};
