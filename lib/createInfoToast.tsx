import { createStandaloneToast, Flex } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

import theme from "config/theme";

const toast = createStandaloneToast({ theme });

export const createInfoToast = (text: string) =>
  toast({
    status: "info",
    isClosable: true,
    title: "",
    duration: 4000,
    render() {
      return (
        <Flex alignItems="center" color="white" bg="black" p="5">
          <InfoIcon mr="4" />
          {text}
        </Flex>
      );
    },
  });

export default createInfoToast;
