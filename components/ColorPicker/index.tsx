import { FC } from "react";
import { Flex, Box } from "@chakra-ui/react";

export interface ColorPickerProps {
  id: string;
  value: string;
  label: string;
  "aria-label": string;
  setValue: (value: string) => void;
}

export const ColorPicker: FC<ColorPickerProps> = (props) => {
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
          type="color"
          width="100%"
          height="100%"
          onChange={(e) => {
            setValue((e.target as any)?.value || value);
          }}
        />
      </Box>
      <label htmlFor={id} aria-label={ariaLabel}>
        {label}
      </label>
    </Flex>
  );
};

export default ColorPicker;
