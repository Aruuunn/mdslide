import AutoSizer from "react-virtualized-auto-sizer";
import { FC, useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { Flex, Box } from "@chakra-ui/react";

import Slide from "components/Slide";
import { useStore } from "lib/stores/presentation";
import { NewSlideButton } from "./components";

export interface SlideNavigatorProps {
  onClickSlide: (idx: number) => any;
}

export const SlideNavigator: FC<SlideNavigatorProps> = (props) => {
  const { onClickSlide } = props;

  const slides = useStore((state) => state.presentation.slides);
  const currentSlideIndex = useStore((state) => state.currentSlideIdx);

  const onAddNewSlide = useStore((store) => store.addNewSlide);

  const listRef = useRef<List<any>>();

  useEffect(() => {
    if (listRef.current) {
      listRef.current?.scrollToItem(slides.length);
    }
  }, [slides.length]);

  return (
    <Flex
      pl={"20px"}
      alignItems="flex-start"
      bg="#F4F4F2"
      width="100%"
      height="100%"
    >
      <NewSlideButton onClick={onAddNewSlide} />

      <Box width={"calc(100% - 115px)"} height={"80px"}>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                ref={listRef}
                width={width}
                height={height}
                itemCount={slides.length}
                itemSize={105}
                layout="horizontal"
              >
                {({ style, index }) => (
                  <Slide
                    key={index}
                    fontFamily={slides[index].fontFamily}
                    constraintSize={{ width: 100, height: 1000 }}
                    mdContent={slides[index].mdContent}
                    fontColor={slides[index].fontColor}
                    bgColor={slides[index].bgColor}
                    onClick={() => {
                      onClickSlide(index);
                    }}
                    opacity={currentSlideIndex === index ? 1 : 0.8}
                    border={currentSlideIndex === index ? "2px" : "1px"}
                    borderColor="#495464"
                    as="button"
                    outline="none"
                    _focus={{
                      opacity: 1,
                    }}
                    mr="5px"
                    borderRadius="3px"
                    style={{
                      ...style,
                      marginLeft: "5px",
                      width: 100,
                      height: 60,
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
