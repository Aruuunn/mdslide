import { FC, SetStateAction, useState, Dispatch } from "react";
import { Box, Text, Flex, Tooltip } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import MDEditor from "@uiw/react-md-editor";

import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";

export interface EditorPanelProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export const EditorPanel: FC<EditorPanelProps> = (props) => {
  const { value, setValue } = props;
  return (
    <Box boxShadow="xl" p="20px" width="100%" height="100%" overflow="hidden">
      <Box width="100%" height="100px"></Box>
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
        preview={"edit"}
        value={value}
        color="gray"
        textareaProps={{ placeholder: "Start Typing..." }}
        onChange={(value) => setValue(value ?? "")}
      />
    </Box>
  );
};
