import { Box, BoxProps } from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";

export type SlideProps = {
  width: number;
  height: number;
  mdContent: string;
  bgColor: string;
  fontColor: string;
} & BoxProps;

export const Slide: FC<SlideProps> = (props) => {
  const { width, height, mdContent, bgColor, fontColor, ...rest } = props;
  return (
    <Box
      width={width}
      overflow="hidden"
      bg={bgColor}
      color={fontColor}
      height={height}
      {...rest}
    >
      <MDEditor.Markdown
        style={{
          fontSize: width / 34,
          padding: width / 16,
          fontFamily: "monospace",
        }}
        source={mdContent}
      />
    </Box>
  );
};

export default Slide;
