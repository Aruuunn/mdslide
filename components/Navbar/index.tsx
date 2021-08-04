import Link from "next/link";
import { FC } from "react";
import { Box } from "@chakra-ui/react";

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  return (
    <Box
      color="#495464"
      as="nav"
      boxShadow="base"
      p="20px"
      width="100%"
      height="70px"
    >
      <Link href="/">
        <>
          <strong>M</strong>SLIDE
        </>
      </Link>
    </Box>
  );
};
