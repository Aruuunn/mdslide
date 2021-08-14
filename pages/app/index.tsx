import Head from "next/head";
import useSWR from "swr";
import axios from "axios";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Container, Text, Box, Flex } from "@chakra-ui/react";

import { DashboardNavbar, Slide } from "../../components";
import { useRouter } from "next/router";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export function Index() {
  const router = useRouter();
  const { data, error } = useSWR("/api/p/all", fetcher);

  if (error) {
    console.error(error);
  }

  if (!data) {
    return null;
  }

  const presentations = data;

  return (
    <Box  bg="#fafafa" minHeight="100vh">
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardNavbar />
              
      <Container maxW="container.xl">
        <Text
          style={{ letterSpacing: "0.15em" }}
          fontWeight="bold"
          mt={"40px"}
          fontSize="xs"
        >
          YOUR PRESENTATIONS
        </Text>

        <Flex mt="30px" wrap={"wrap"}>
          {presentations.map((presentation, idx) => (
            <Box
              onClick={() => {
                router.push(`/app/${presentation.id}`);
              }}
              p="2"
              borderRadius="8px"
              mr="6"
              mb="6"
              key={idx}
              width="auto"
              boxShadow="base"
              bg="white"
              tabIndex={0}
              _hover={{boxShadow: "lg"}}
              _focus={{boxShadow: "lg"}}
            >
              <Slide
                width={100 * 3}
                borderWidth="1px"
              borderColor="gray.100"
                height={56.25 * 3}
                bgColor={presentation.coverSlide.bgColor}
                fontColor={presentation.coverSlide.fontColor}
                mdContent={presentation.coverSlide.mdContent}
              />

              <Text mt={"10px"} p="5px" ml="5px">
                {presentation.title}
              </Text>
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default withPageAuthRequired(Index);
