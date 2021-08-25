import { FC } from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";

import { getSlideSize } from "./getSlideSize";
import { getScaleFactor } from "./getScaleFactor";

export type SlideProps = {
  constraintSize: { height: number; width: number };
  mdContent: string;
  bgColor: string;
  fontColor: string;
  fontFamily: string;
} & BoxProps;

export const Slide: FC<SlideProps> = (props) => {
  const { constraintSize, mdContent, bgColor, fontColor, fontFamily, ...rest } =
    props;

  const slideSize = getSlideSize(constraintSize);

  return (
    <Box
      {...rest}
      width={slideSize.width}
      overflow="hidden"
      height={slideSize.height}
      bg={bgColor}
      id="slide-outer"
      position="relative"
    >
      <Box
        width={1920}
        bg={bgColor}
        position="absolute"
        top={-1 * 540 + slideSize.height / 2}
        left={-1 * (1920 / 2) + slideSize.width / 2}
        transform={`scale(${getScaleFactor(constraintSize)})`}
        color={fontColor}
        height={1080}
      >
        <MDEditor.Markdown
          style={{
            fontSize: 1920 / 34,
            paddingLeft: "200px",
            paddingRight: "200px",
            fontFamily,
          }}
          source={mdContent}
        />
      </Box>
    </Box>
  );
};

export default Slide;
