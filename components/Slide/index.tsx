import { Box } from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";

export interface SlideProps {
  width: number;
  height: number;
  mdContent: string;
}

export const Slide: FC<SlideProps> = (props) => {
  const { width, height, mdContent } = props;
  return (
    <Box width={width} bg="white" overflow="hidden" p="20" height={height}>
      <MDEditor.Markdown source={mdContent} />
    </Box>
  );
};

export default Slide;
