import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import theme from "../theme";

import "../styles/global.css";
import "../styles/editor.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
