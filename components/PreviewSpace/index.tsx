import { FC, useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useStore } from "lib/stores/EditorPage";

import { Slide } from "../Slide";

export interface PreviewSpaceProps {
  mdContent: string;
  bgColor: string;
  fontColor: string;
}

const getWidth = () => {
  if (typeof window === "undefined") return 0;

  const element = window.document.querySelector("#preview-space");
  if (element) {
    return element.getBoundingClientRect().width;
  }
  return 0;
};

function untilAsync(fn: () => any, predicate: () => boolean, interval: number) {
  const intv = setInterval(() => {
    fn();

    console.debug("Called fn");

    if (predicate()) {
      console.log("Predicate satisfied");
      clearInterval(intv);
    }
  }, interval);
}

function useSpaceWidth(): number {
  const [width, setWidth] = useState<number>(getWidth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        setWidth(getWidth);
      });

      untilAsync(
        () => setWidth(getWidth),
        () => width !== 0,
        500
      );
    }
  }, []);

  return width;
}

function getSlideSize(spaceWidth: number): { width: number; height: number } {
  const width = spaceWidth > 100 ? spaceWidth - 100 : 0;

  return {
    width: width,
    height: 9 * (width / 16),
  };
}

export const PreviewSpace: FC<PreviewSpaceProps> = (props) => {
  const { mdContent, fontColor, bgColor } = props;
  const spaceWidth = useSpaceWidth();
  const { width, height } = getSlideSize(spaceWidth);
  const store = useStore();

  return (
    <Box position="relative" width="100%" height="100%">
      <Flex
        position="absolute"
        top="calc(50% - 15px)"
        right="25px"
        p="10px"
        bg="white"
        borderRadius="50%"
        height="30px"
        alignItems="center"
        justify="center"
        width="30px"
        onClick={store.goToNextSlide}
        boxShadow="lg"
      >
        <ChevronRightIcon />
      </Flex>

      <Flex
        position="absolute"
        top="calc(50% - 15px)"
        left="25px"
        p="10px"
        bg="white"
        borderRadius="50%"
        height="30px"
        alignItems="center"
        justify="center"
        width="30px"
        onClick={store.goToPrevSlide}
        boxShadow="lg"
      >
        <ChevronLeftIcon />
      </Flex>

      <Flex
        id="preview-space"
        p="20px"
        style={{ backgroundColor: "#F4F4F2" }}
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        {width !== 0 ? (
          <Slide
            bgColor={bgColor}
            fontColor={fontColor}
            width={width}
            mdContent={mdContent}
            height={height}
            boxShadow="lg"
          />
        ) : null}{" "}
      </Flex>
    </Box>
  );
};
