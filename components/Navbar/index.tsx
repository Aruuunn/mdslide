import Link from "next/link";
import { FC } from "react";
import { Flex, Text } from "@chakra-ui/react";

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  return (
    <Flex
      color="#495464"
      as="nav"
      p="20px"
      boxShadow="sm"
      width="100%"
      height="70px"
      alignItems="center"
    >
      <Link href="/">
        <Text fontSize="xl">
          <strong>MD</strong>SLIDE
        </Text>
      </Link>
    </Flex>
  );
};
