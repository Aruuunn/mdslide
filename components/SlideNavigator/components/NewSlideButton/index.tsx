import { FC } from "react";
import { IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export interface NewSlideButtonProps {
  onClick: () => void;
}

export const NewSlideButton: FC<NewSlideButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <IconButton
      colorScheme="black"
      height="57.25px"
      opacity="1"
      borderRadius="3px"
      width="100px"
      onClick={onClick}
      variant="outline"
      _hover={{ bg: "black", color: "white", opacity: 1, boxShadow: "none" }}
      _focus={{ bg: "black", color: "white", opacity: 1, boxShadow: "none" }}
      aria-label="Add new Slide"
      icon={<AddIcon />}
    />
  );
};

export default NewSlideButton;
