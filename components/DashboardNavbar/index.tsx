import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import {
  Container,
  Flex,
  Spacer,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  IconButton,
  MenuList,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Logo } from "../Logo";
import { PrimaryButton } from "../PrimayButton";

export interface DashboardNavbarProps {}

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const { user } = useUser();

  const handleNewPresentation = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post("/api/p/new");

      if (typeof data?.id === "string") {
        await router.push(`/app/${data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="nav" borderBottom="1px" bg="white" borderColor="gray.200">
      <Container maxW="container.xl">
        <Flex alignItems="center" height="70px">
          <Logo />
          <Spacer />
          <PrimaryButton
            size="md"
            isLoading={isLoading}
            onClick={handleNewPresentation}
            leftIcon={<AddIcon fontSize={"sm"} />}
          >
            New
          </PrimaryButton>

          <Menu>
            <MenuButton
              as={IconButton}
              borderRadius="50%"
              bg="transparent"
              ml="25px"
              icon={
                <Avatar
                  height="37px"
                  width="37px"
                  name={user.name ?? ""}
                  src={user.picture ?? ""}
                />
              }
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem as={"a"} href="/api/auth/logout">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};
