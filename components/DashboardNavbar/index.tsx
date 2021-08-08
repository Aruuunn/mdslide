import axios from "axios";
import { useRouter } from "next/router"
import { FC, useState } from "react";
import { Container, Flex, Spacer, Box, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons"
import { Logo } from "../Logo";

export interface DashboardNavbarProps {}

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false);

    const handleNewPresentation = async  () => {
        setLoading(true);

        try {
          const {data} = await axios.post("/api/p/new");

          if (typeof data?.id === "string") {
              await router.push(`/app/${data.id}`);
          }

        } catch (e) {
            console.error(e)
        } finally {
             setLoading(false);
        }
    }

    return <Box as="nav" borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.xl">
            <Flex alignItems="center"  height="70px">
                <Logo />
                <Spacer/>
                <Button isLoading={isLoading} onClick={handleNewPresentation} leftIcon={<AddIcon fontSize={"sm"}/>} variant={"solid"} colorScheme="blue">New</Button>
            </Flex>
        </Container>
    </Box>
}
