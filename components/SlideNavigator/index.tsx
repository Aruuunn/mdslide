import { FC } from "react";
import { Flex, Box, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Slide } from "../Slide";

interface Slide {
  bgColor: string;
  fontColor: string;
  mdContent: string;
}

export interface SlideNavigatorProps {
  onAddNewSlide: () => void;
  slides: Slide[];
  currentSlide: number;
  onClickSlide: (idx: number) => any;
}

interface NewSlideButtonProps {
  onClick: () => void;
}

const NewSlideButton: FC<NewSlideButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <IconButton
      colorScheme="black"
      height="54px"
      opacity="0.4"
      width="100px"
      onClick={onClick}
      variant="outline"
      _hover={{ bg: "black", color: "white", opacity: 1, boxShadow: "none" }}
      _focus={{ bg: "black", color: "white", opacity: 1, boxShadow: "none" }}
      aria-label="Add new Slide"
      icon={<AddIcon />}
    />
  );
};

export const SlideNavigator: FC<SlideNavigatorProps> = (props) => {
  const { onAddNewSlide, slides, currentSlide, onClickSlide } = props;

  return (
    <Flex
      p="20px"
      alignItems="center"
      justifyContent="center"
      bg="#F4F4F2"
      width="100%"
      height="100%"
    >
      <Flex mr="5px">
        {slides.map((slide, idx) => (
          <Slide
            key={idx}
            width={100}
            height={56.25}
            mdContent={slide.mdContent}
            fontColor={slide.fontColor}
            bgColor={slide.bgColor}
            onClick={() => {
              onClickSlide(idx);
            }}
            opacity={currentSlide === idx ? 1 : 0.5}
            border={currentSlide === idx ? "2px" : "1px"}
            borderColor="black"
            as="button"
            _focus={{
              outline: currentSlide === idx ? "none" : "2px solid lightblue",
              opacity: 1,
            }}
            ml="5px"
            p="3px"
            borderRadius="5px"
          />
        ))}
      </Flex>
      <NewSlideButton onClick={onAddNewSlide} />
    </Flex>
  );
};
