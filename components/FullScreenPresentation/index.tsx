import { FC, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import Slide from "components/Slide";
import LoadFonts from "components/LoadFonts";
import createToast from "lib/createInfoToast";
import { useStore } from "lib/stores/presentation";

export interface FullScreenPresentationProps {
  onClose: () => void;
}

export const FullScreenPresentation: FC<FullScreenPresentationProps> = (
  props
) => {
  const { onClose } = props;
  const slides = useStore((state) => state.presentation.slides);
  const currentSlideIndex = useStore((state) => state.currentSlideIdx);

  const currentSlide = slides[currentSlideIndex];

  useEffect(() => {
    document.body.onfullscreenchange = () => {
      if (document.fullscreenElement !== document.body) {
        onClose();
      }
    };

    document.body.requestFullscreen();

    createToast("Use Left and Right Arrow keys to navigate");
  }, []);

  return (
    <>
      <LoadFonts fontFamilies={slides.map((s) => s.fontFamily)} />
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
        <Text
          position="fixed"
          top="5"
          zIndex={1}
          color={currentSlide.fontColor}
          right="5"
        >
          {currentSlideIndex + 1}/{slides.length}
        </Text>
        <Slide
          constraintSize={{
            width: window.screen.width,
            height: window.screen.height,
          }}
          fontFamily={currentSlide.fontFamily}
          bgColor={currentSlide.bgColor}
          fontColor={currentSlide.fontColor}
          mdContent={currentSlide.mdContent}
          height={window.screen.height}
          width={window.screen.width}
        />
      </Box>
    </>
  );
};
