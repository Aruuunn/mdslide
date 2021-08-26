import { Flex, FlexProps } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useStore } from "lib/stores/presentation";

export type PrevSlideButtonProps = FlexProps;

export const PrevSlideButton = (props: PrevSlideButtonProps) => {
  const onClick = useStore((store) => store.goToPrevSlide);
  const disabled = useStore((state) => state.currentSlideIdx === 0);

  return (
    <Flex
      as="button"
      aria-label="go to previous slide"
      mr="5"
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
      <ChevronLeftIcon w={6} h={6} />
    </Flex>
  );
};
