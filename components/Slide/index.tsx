import { Box } from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";

export interface SlideProps {
  width: number;
  height: number;
  mdContent: string;
  bgColor: string;
  fontColor: string;
}

export const Slide: FC<SlideProps> = (props) => {
  const { width, height, mdContent, bgColor, fontColor } = props;
  return (
    <Box
      boxShadow="lg"
      width={width}
      bg="white"
      overflow="hidden"
      p="20"
      bg={bgColor}
      color={fontColor}
      height={height}
    >
      <MDEditor.Markdown source={mdContent} />
    </Box>
  );
};

export default Slide;
