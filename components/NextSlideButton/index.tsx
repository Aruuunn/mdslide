import { Flex, FlexProps } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useStore } from "lib/stores/presentation";

export type NextSlideButtonProps = FlexProps;

export const NextSlideButton = (props: NextSlideButtonProps) => {
  const onClick = useStore((store) => store.goToNextSlide);
  const disabled = useStore(
    (state) => state.currentSlideIdx === state.presentation.slides.length - 1
  );

  return (
    <Flex
      as="button"
      aria-label="go to next slide"
      ml="5"
      p="10px"
      bg="#fafafa"
      borderRadius="50%"
      height="36px"
      alignItems="center"
      justify="center"
      width="36px"
      boxShadow="base"
      color="#495464"
      _disabled={{ cursor: "not-allowed" }}
      _hover={{ boxShadow: "md" }}
      _focus={{ boxShadow: "md" }}
      {...props}
      onClick={onClick}
      disabled={disabled}
    >
      <ChevronRightIcon w={6} h={6} />
    </Flex>
  );
};
