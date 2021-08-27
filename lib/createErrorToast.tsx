import { createStandaloneToast, Flex } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

import theme from "config/theme";

const toast = createStandaloneToast({ theme });

export const createErrorToast = (text: string) =>
  toast({
    status: "error",
    isClosable: true,
    title: text,
    duration: 5000,
    position: "bottom-right",
  });

export default createErrorToast;
