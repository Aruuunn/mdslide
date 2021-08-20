import { Box, BoxProps } from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { getScaleFactor } from "./getScaleFactor";
import { getSlideSize } from "./getSlideSize";

export type SlideProps = {
  constraintSize: { height: number; width: number };
  mdContent: string;
  bgColor: string;
  fontColor: string;
} & BoxProps;

export const Slide: FC<SlideProps> = (props) => {
  const { constraintSize, mdContent, bgColor, fontColor, ...rest } = props;

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
            fontFamily: "monospace",
            paddingLeft: "200px",
            paddingRight: "200px",
          }}
          source={mdContent}
        />
      </Box>
    </Box>
  );
};

export default Slide;
