import { FC, useState } from "react";
import { Box, Text, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import MDEditor from "@uiw/react-md-editor";

import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";

export interface EditorPanelProps {}

export const EditorPanel: FC<EditorPanelProps> = (props) => {
  const [value, setValue] = useState("");
  return (
    <Box
      style={{ backgroundColor: "F4F4F2" }}
      p="20px"
      width="100%"
      height="100%"
    >
      <Box width="100%" height="100px"></Box>
      <Text
        color="#BBBFCA"
        style={{ letterSpacing: "0.15em" }}
        fontWeight="bold"
        pb="3"
        ml="0.5"
        fontSize="xs"
      >
        EDITOR{" "}
        <Tooltip
          label="This editor uses Markdown format. To learn more about it, click it!"
          aria-label="This editor uses Markdown format. To learn more about it, click it!"
        >
          <a
            target="_blank"
            href="https://www.markdownguide.org/basic-syntax/"
            rel="noreferrer"
          >
            <InfoIcon />
          </a>
        </Tooltip>
      </Text>
      <MDEditor
        preview={"edit"}
        value={value}
        color="gray"
        textareaProps={{ placeholder: "Start Typing..." }}
        onChange={(value) => setValue(value ?? "")}
      />
    </Box>
  );
};
