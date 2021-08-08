import Link from "next/link";
import { useRouter } from 'next/router'
import {useUser} from "@auth0/nextjs-auth0";
import { FC } from "react";
import { Flex, Spacer, Avatar, Button } from "@chakra-ui/react";
import { Logo } from "../Logo";

export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (props) => {
  const {user, isLoading} = useUser();
  const router = useRouter();

  return (
    <Flex
      color="#495464"
      as="nav"
      p="20px"
      boxShadow="xl"
      width="100%"
      height="70px"
      alignItems="center"
    >
      <Link href="/">
        <Logo />
      </Link>
      <Spacer/>
      {user ? <Avatar size={"sm"} name={user.name ?? ""} src={user.picture ?? ""}/>: <Button onClick={e => {
        e.preventDefault();
        router.push("/api/auth/login")
      }} isLoading={isLoading} variant="outline" colorScheme="black">Sign Up</Button>}
    </Flex>
  );
};
