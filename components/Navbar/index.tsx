import axios from "axios";
import { debounce } from "debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { Input, Flex, Spacer, Avatar, Button } from "@chakra-ui/react";
import { AccountOptions } from "../AccountOptions";
import { Logo } from "../Logo";

export interface NavbarProps {
  title: string;
  pid: string;
}

export const Navbar: FC<NavbarProps> = (props) => {
  const { title: initialTitle, pid } = props;
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);

  const updateRemote = debounce(async (newTitle: string) => {
    // TODO handle error.
    await axios.patch(`/api/p/${pid}/title`, { title: newTitle });
  }, 500);

  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);

    await updateRemote(newTitle.trim() || "Untitled");
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
        <Logo fontSize="xl" />
      </Link>
      <Spacer />
      <Input
        maxWidth="400px"
        textAlign="center"
        value={title}
        required
        isInvalid={title?.trim() === ""}
        focusBorderColor="black"
        onChange={(e) => updateTitle(e.target.value)}
      />
      <Spacer />
      <AccountOptions size="sm" />
    </Flex>
  );
};
