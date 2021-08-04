import { useState } from "react";
import Head from "next/head";
import { Grid, GridItem } from "@chakra-ui/react";

import {
  EditorPanel,
  Navbar,
  PreviewSpace,
  SlideNavigator,
} from "../components";

export default function Home() {
  const [editorState, setEditorState] = useState("");

  return (
    <div>
      <Head>
        <title>MSLIDE</title>
      </Head>
      <Navbar />
      <Grid
        height={"calc(100vh - 70px)"}
        templateRows="repeat(12, 1fr)"
        templateColumns="repeat(3, 1fr)"
        as="main"
      >
        <GridItem rowSpan={12} colSpan={1}>
          <EditorPanel value={editorState} setValue={setEditorState} />
        </GridItem>
        <GridItem rowSpan={11} colSpan={2}>
          <PreviewSpace />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <SlideNavigator />
        </GridItem>
      </Grid>
    </div>
  );
}
