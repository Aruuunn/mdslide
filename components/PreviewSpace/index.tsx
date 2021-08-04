import { FC } from "react";
import { Box } from "@chakra-ui/react";

export interface PreviewSpaceProps {}

export const PreviewSpace: FC<PreviewSpaceProps> = (props) => {
  return (
    <Box
      p="20px"
      style={{ backgroundColor: "#F4F4F2" }}
      width="100%"
      height="100%"
    >
      {" "}
    </Box>
  );
};
