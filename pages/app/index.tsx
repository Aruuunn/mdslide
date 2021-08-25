import useSWR from "swr";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
  Container,
  Text,
  Box,
  Flex,
  Skeleton,
  Progress,
} from "@chakra-ui/react";

import { HomeNavbar, Slide, LoadFonts } from "components";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export function Index() {
  const router = useRouter();
  const { data, error } = useSWR("/api/p/all", fetcher);

  const [isNextRouteLoading, setNextRouteLoading] = useState(false);

  if (error) {
    console.error(error);
  }

  const isLoading = !data;

  const presentations = data ?? [{}, {}, {}];

  const fontFamilies = presentations
    .map((p) => p?.coverSlide?.fontFamily)
    .filter(Boolean);

  return (
    <Box bg="#fafafa" minHeight="100vh">
      <Head>
        <title>Dashboard</title>
      </Head>
      <LoadFonts fontFamilies={fontFamilies} />
      {isNextRouteLoading ? (
        <Progress size="xs" colorScheme="blackAlpha" isIndeterminate />
      ) : null}
      <HomeNavbar isDisabled={isNextRouteLoading} />

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
          {presentations.length === 0 && !isLoading ? (
            <Text color="gray.500" fontSize="md">
              Your presentations show up here.
            </Text>
          ) : null}
          {presentations.map((presentation, idx) => (
            <Box
              as="button"
              onClick={() => {
                if (isLoading) return;

                setNextRouteLoading(true);
                router.push(`/app/${presentation.id}`);
              }}
              p="2"
              borderRadius="8px"
              mr="6"
              disabled={isNextRouteLoading}
              mb="6"
              key={idx}
              width="auto"
              bg="white"
              opacity={isNextRouteLoading ? 0.8 : 1}
              tabIndex={0}
              boxShadow="base"
              _hover={{ boxShadow: isNextRouteLoading ? "base" : "lg" }}
              _focus={{
                boxShadow: isNextRouteLoading ? "base" : "lg",
                outline: "black solid 2px",
              }}
            >
              {isLoading ? (
                <Skeleton width={100 * 3 + "px"} height={56.25 * 3 + "px"} />
              ) : (
                <>
                  <Slide
                    constraintSize={{ width: 300, height: 1000 }}
                    borderWidth="1px"
                    borderColor="gray.100"
                    fontFamily={presentation.coverSlide.fontFamily ?? "Inter"}
                    bgColor={presentation.coverSlide.bgColor}
                    fontColor={presentation.coverSlide.fontColor}
                    mdContent={presentation.coverSlide.mdContent}
                  />
                </>
              )}

              {isLoading ? (
                <Skeleton mt={"10px"} p="5px" width="100%" height="20px" />
              ) : (
                <Text mt={"10px"} p="5px" ml="5px">
                  {presentation?.title}
                </Text>
              )}
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default withPageAuthRequired(Index);
