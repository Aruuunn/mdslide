import Link from "next/link";
import { FC } from "react";
import { Flex } from "@chakra-ui/react";

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  return (
    <Flex
      color="#495464"
      as="nav"
      boxShadow="base"
      p="20px"
      width="100%"
      height="70px"
      alignItems="center"
    >
      <Link href="/">
        <>
          <strong>M</strong>SLIDE
        </>
      </Link>
    </Flex>
  );
};
