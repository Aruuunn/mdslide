import axios from "axios";
import { debounce } from "debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import { FC, useState } from "react";
import { Input, Flex, Spacer, Avatar, Button } from "@chakra-ui/react";
import { Logo } from "../Logo";

export interface NavbarProps { title: string; pid: string; }

export const Navbar: FC<NavbarProps> = (props) => {
  const { title: initialTitle, pid } = props;
  const { user, isLoading } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);

  const updateRemote = debounce(async (newTitle: string) => {
     // TODO handle error.
     await axios.patch(`/api/p/${pid}/title`, { title: newTitle });
  }, 300);

  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);

    if (newTitle.trim() === "") 
      return;

     await updateRemote(newTitle);
  };

  
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
      <Spacer />
      <Input maxWidth="400px" textAlign="center" value={title} onChange={(e) => updateTitle(e.target.value)}/>
      <Spacer />
      {user ? (
        <Avatar size={"sm"} name={user.name ?? ""} src={user.picture ?? ""} />
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            router.push("/api/auth/login");
          }}
          isLoading={isLoading}
          variant="outline"
          colorScheme="black"
        >
          Sign Up
        </Button>
      )}
    </Flex>
  );
};
