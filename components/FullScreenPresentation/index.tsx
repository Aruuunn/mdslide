import { FC, useEffect } from "react";
import { Box, Text, IconButton, Icon } from "@chakra-ui/react";
import Slide from "components/Slide";
import LoadFonts from "components/LoadFonts";
import createToast from "lib/createInfoToast";
import { useStore } from "lib/stores/presentation";

export interface FullScreenPresentationProps {}

export const FullScreenPresentation: FC<FullScreenPresentationProps> = (
  props
) => {
  const slides = useStore((state) => state.presentation.slides);
  const currentSlideIndex = useStore((state) => state.currentSlideIdx);
  const onClose = useStore((store) => store.stopPresentationMode);

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
        <IconButton
          aria-label="exit presentation mode"
          position="fixed"
          top="5"
          left="5"
          bg="transparent"
          _hover={{
            bg: "transparent",
            border: "1px solid " + currentSlide.fontColor,
          }}
          zIndex={1}
          onClick={() => {
            document.exitFullscreen().finally(() => {
              onClose();
            });
          }}
        >
          <Icon height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              fill={currentSlide.fontColor}
            />
          </Icon>
        </IconButton>
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
