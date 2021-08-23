import { FC, useEffect } from "react";
import dynamic from "next/dynamic";

import { Slide } from "../Slide";
import { Box, Text, useToast, Flex } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { Slide as ISlide } from "model/slide";

const FontPicker = dynamic(() => import("@arunmurugan/font-picker-react"), {
  ssr: false,
});

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

    const keydownEventHandler = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrevSlide();
          break;
        case "ArrowRight":
          onNextSlide();
          break;
      }
    };

    window.addEventListener("keydown", keydownEventHandler);

    createToast("Use Left and Right Arrow keys to navigate");

    return () => {
      window.removeEventListener("keydown", keydownEventHandler);
    };
  }, []);

  return (
    <>
      <Box display="none">
        {/* @ts-ignore */}
        <FontPicker
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY}
          activeFontFamily={currentSlide.fontFamily}
          pickerId={currentSlideIdx.toString()}
          limit={50}
          onChange={() => {}}
        />
      </Box>
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
          idx={currentSlideIdx}
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
