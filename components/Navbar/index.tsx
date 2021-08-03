import Link from "next/link";
import {FC} from "react";
import { Box } from "@chakra-ui/react"

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {

    return (
        <nav>
          <Box p="20px" width="100%" bg="red" height="70px">
                  <Link href="/">
                      <>
                          <strong>M</strong>SLIDE
                      </>
                  </Link>
          </Box>
        </nav>
    )
}
