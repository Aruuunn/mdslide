import dynamic from "next/dynamic";
import MDEditor from "@uiw/react-md-editor";
import { FC } from "react";
import { Box, Text, Flex, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

import ColorPicker from "components/ColorPicker";

import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";

const FontPicker = dynamic(() => import("font-picker-react"), { ssr: false });

export interface EditorPanelProps {
  value: string;
  bgColor: string;
  fontColor: string;
  fontFamily: string;
  setValue: (value: string) => any;
  setBgColor: (value: string) => any;
  setFontColor: (value: string) => any;
  setFontFamily: (value: string) => any;
}

export const EditorPanel: FC<EditorPanelProps> = (props) => {
  const {
    value,
    setValue,
    bgColor,
    setBgColor,
    fontColor,
    setFontColor,
    fontFamily,
    setFontFamily,
  } = props;

  return (
    <Box width="100%" height="100%" overflow="hidden">
      <Box
        width="100%"
        p="20px"
        height="200px"
        fontSize="xs"
        color="#495464"
        bg="#fafafa"
      >
        <Text className="spaced-bold-text" ml="0.5" mr="2" mt="0.7">
          APPEARANCE
        </Text>
        <Flex mt="18px" width="100%">
          <ColorPicker
            id="bg-color-picker"
            aria-label="Background Color Picker"
            label="BG"
            value={bgColor}
            setValue={setBgColor}
          />
          <ColorPicker
            id="font-color-picker"
            aria-label="Font Color Picker"
            label="A"
            value={fontColor}
            setValue={setFontColor}
          />
        </Flex>
        {typeof window !== "undefined" ? (
          // @ts-ignore
          <FontPicker
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_FONT_API_KEY}
            activeFontFamily={fontFamily}
            limit={50}
            sort="popularity"
            onChange={(nextFont) => {
              if (nextFont.family !== fontFamily) {
                setFontFamily(nextFont.family);
              }
            }}
          />
        ) : null}
      </Box>
      <Box
        p="20px"
        width="100%"
        borderTop="1px"
        borderColor="gray.200"
        height="100%"
      >
        <Flex pb="3" alignItems="center" fontSize="xs" color="#495464">
          <Text
            style={{ letterSpacing: "0.15em" }}
            fontWeight="bold"
            ml="0.5"
            mr="2"
            mt="0.7"
          >
            EDITOR{" "}
          </Text>
          <Tooltip
            label="This editor uses Markdown format. To learn more about it, click  "
            aria-label="This editor uses Markdown format. To learn more about it, click  "
          >
            <a
              target="_blank"
              href="https://www.markdownguide.org/basic-syntax/"
              rel="noreferrer"
            >
              <InfoIcon color="#BBBFCA" fontSize="xs" />
            </a>
          </Tooltip>
        </Flex>
        <MDEditor
          fullscreen={false}
          autoFocus={true}
          enableScroll={true}
          preview={"edit"}
          value={value}
          color="gray"
          toolbarHeight={38}
          textareaProps={{ placeholder: "Start Typing..." }}
          onChange={(value) => setValue(value ?? "")}
        />
      </Box>
    </Box>
  );
};

export default EditorPanel;
