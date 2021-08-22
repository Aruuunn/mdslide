import { FC, useState } from "react";
import { Box, Text, Flex, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import dynamic from "next/dynamic";
const FontPicker = dynamic(() => import("font-picker-react"), { ssr: false });

import MDEditor from "@uiw/react-md-editor";

import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";

export interface EditorPanelProps {
  value: string;
  setValue: (value: string) => any;
  bgColor: string;
  setBgColor: (value: string) => any;
  fontColor: string;
  setFontColor: (value: string) => any;
}

interface ColorPickerProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  "aria-label": string;
  id: string;
}

const ColorPicker: FC<ColorPickerProps> = (props) => {
  const { value, setValue, label, id, "aria-label": ariaLabel } = props;
  return (
    <Flex mr="13px" direction="column" alignItems="center" width="40px">
      <Box
        border="1px"
        borderColor="gray.300"
        width="40px"
        height="40px"
        bg={value}
        borderRadius="5px"
      >
        <Box
          opacity="0"
          as="input"
          id={id}
          value={value}
          onChange={(e) => {
            setValue((e.target as any)?.value || value);
          }}
          type="color"
          width="100%"
          height="100%"
        />
      </Box>

      <label htmlFor={id} aria-label={ariaLabel}>
        {label}
      </label>
    </Flex>
  );
};

export const EditorPanel: FC<EditorPanelProps> = (props) => {
  const { value, setValue, bgColor, setBgColor, fontColor, setFontColor } =
    props;

  const [fontFamily, setFontFamily] = useState("Open Sans");

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
        <Text
          style={{ letterSpacing: "0.15em" }}
          fontWeight="bold"
          ml="0.5"
          mr="2"
          mt="0.7"
        >
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
            limit={200}
            sort="popularity"
            onChange={(nextFont) => setFontFamily(nextFont.family)}
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
