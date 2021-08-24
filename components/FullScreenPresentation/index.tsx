import { FC, useEffect } from "react";

import { Slide } from "../Slide";
import { Box, Text, useToast, Flex } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { Slide as ISlide } from "model/slide";
import { LoadFonts } from "components/LoadFonts";

export interface FullScreenPresentationProps {
  onNextSlide: () => void;
  onPrevSlide: () => void;
  onClose: () => void;
  currentSlideIdx: number;
  slides: ISlide[];
}

export const FullScreenPresentation: FC<FullScreenPresentationProps> = (
  props
) => {
  const { onNextSlide, slides, onPrevSlide, onClose, currentSlideIdx } = props;
  const toast = useToast();

  const currentSlide = slides[currentSlideIdx];

  const createToast = (text: string) =>
    toast({
      status: "info",
      isClosable: true,
      title: "",
      duration: 4000,
      render() {
        return (
          <Flex alignItems="center" color="white" bg="black" p="5">
            <InfoIcon mr="4" />
            {text}
          </Flex>
        );
      },
    });

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
          {currentSlideIdx + 1}/{slides.length}
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
