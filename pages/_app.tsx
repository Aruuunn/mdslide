import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "@auth0/nextjs-auth0";

import theme from "config/theme";

import "focus-visible/dist/focus-visible";
import "styles/global.css";
import "styles/editor.css";
import "styles/md-preview.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default MyApp;
