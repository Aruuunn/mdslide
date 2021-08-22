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

type Size = { height: number; width: number };

const getConstraint = (): Size => {
  if (typeof window === "undefined") return { width: 0, height: 0 };

  const element = window.document.querySelector("#preview-space");
  if (element) {
    return {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    };
  }
  return { width: 0, height: 0 };
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

function useConstraint(): Size {
  const [constraint, setConstraint] = useState<Size>(getConstraint);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        setConstraint(getConstraint);
      });

      untilAsync(
        () => setConstraint(getConstraint),
        () => constraint.width !== 0,
        500
      );
    }
  }, []);

  return constraint;
}

export const PreviewSpace: FC<PreviewSpaceProps> = (props) => {
  const { mdContent, fontColor, bgColor } = props;
  const constraint = useConstraint();

  const store = useStore();

  return (
    <Box position="relative" width="100%" height="100%">
      <Flex
        as="button"
        aria-label="go to previous slide"
        position="absolute"
        top="calc(50% - 15px)"
        left="15px"
        p="10px"
        bg="#fafafa"
        borderRadius="50%"
        height="30px"
        alignItems="center"
        justify="center"
        width="30px"
        onClick={store.goToPrevSlide}
        boxShadow="base"
        color="#495464"
        disabled={store.currentSlideIdx === 0}
        _disabled={{ cursor: "not-allowed" }}
        _hover={{ boxShadow: "md" }}
        _focus={{ boxShadow: "md" }}
      >
        <ChevronLeftIcon />
      </Flex>

      <Flex
        position="absolute"
        as="button"
        aria-label="go to next slide"
        top="calc(50% - 15px)"
        right="15px"
        p="10px"
        bg="#fafafa"
        borderRadius="50%"
        height="30px"
        alignItems="center"
        justify="center"
        width="30px"
        onClick={store.goToNextSlide}
        boxShadow="base"
        color="#495464"
        disabled={
          store.currentSlideIdx === store.presentation.slides.length - 1
        }
        _disabled={{ cursor: "not-allowed" }}
        _hover={{ boxShadow: "md" }}
        _focus={{ boxShadow: "md" }}
      >
        <ChevronRightIcon />
      </Flex>

      <Flex
        id="preview-space"
        p="20px"
        style={{ backgroundColor: "#f6f5f5" }}
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        {constraint.width !== 0 ? (
          <Slide
            bgColor={bgColor}
            idx={store.currentSlideIdx}
            fontColor={fontColor}
            constraintSize={{ ...constraint, width: constraint.width - 100 }}
            mdContent={mdContent}
            boxShadow="lg"
          />
        ) : null}{" "}
      </Flex>
    </Box>
  );
};
