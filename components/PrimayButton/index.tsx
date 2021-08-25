import { chakra, Button } from "@chakra-ui/react";

export const PrimaryButton = chakra(Button, {
  baseStyle: {
    bg: "black",
    color: "white",
    borderRadius: "6px",
    border: "1px solid black",
    _hover: {
      bg: "white",
      color: "black",
      "&:disabled": {
        bg: "black",
        color: "white",
      },
    },
    _focus: {
      bg: "white",
      color: "black",
    },
    _disabled: {
      bg: "black",
      color: "white",
    },
  },
});

export default PrimaryButton;
