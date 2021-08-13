import { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

export type LogoProps = TextProps;

export const Logo: FC<LogoProps> = (props) => {
  return (
    <Text fontSize="xl" {...props}>
      <strong>MD</strong>SLIDE
    </Text>
  );
};
