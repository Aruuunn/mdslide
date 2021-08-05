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
      overflow="hidden"
      bg={bgColor}
      color={fontColor}
      height={height}
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
