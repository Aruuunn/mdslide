import { FC } from "react";
import { FixedSizeList as List } from "react-window";
import { Flex, Box, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import AutoSizer from "react-virtualized-auto-sizer";
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
      height="57.25px"
      opacity="1"
      borderRadius="3px"
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
      pl={"20px"}
      alignItems="flex-start"
      bg="#F4F4F2"
      width="100%"
      height="100%"
    >
      <NewSlideButton onClick={onAddNewSlide} />

      <Box width={"calc(100% - 105px)"} height={"80px"}>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                width={width}
                height={height}
                itemCount={slides.length}
                itemSize={105}
                layout="horizontal"
              >
                {({ style, index }) => (
                  <Slide
                    key={index}
                    width={100}
                    height={56.25}
                    mdContent={slides[index].mdContent}
                    fontColor={slides[index].fontColor}
                    bgColor={slides[index].bgColor}
                    onClick={() => {
                      onClickSlide(index);
                    }}
                    opacity={currentSlide === index ? 1 : 0.8}
                    border={currentSlide === index ? "2px" : "1px"}
                    borderColor="#495464"
                    as="button"
                    _focus={{
                      outline:
                        currentSlide === index ? "none" : "1px solid black",
                      opacity: 1,
                    }}
                    p="3px"
                    ml="5px"
                    borderRadius="3px"
                    style={{
                      ...style,
                      marginLeft: "5px",
                      width: 100,
                      height: 57,
                    }}
                  />
                )}
              </List>
            );
          }}
        </AutoSizer>
      </Box>
    </Flex>
  );
};
