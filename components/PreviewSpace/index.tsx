import { FC } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import Slide from "components/Slide";
import useConstraint from "./useConstraint";
import { useStore } from "lib/stores/presentation";

export interface PreviewSpaceProps {
  mdContent: string;
  bgColor: string;
  fontColor: string;
  fontFamily: string;
}

export const PreviewSpace: FC<PreviewSpaceProps> = (props) => {
  const { mdContent, fontColor, bgColor, fontFamily } = props;
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
            fontFamily={fontFamily}
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

export default PreviewSpace;
