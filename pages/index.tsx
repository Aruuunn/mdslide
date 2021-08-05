import { useState } from "react";
import Head from "next/head";
import debounce from "debounce";
import { Grid, GridItem } from "@chakra-ui/react";

import {
  EditorPanel,
  Navbar,
  PreviewSpace,
  SlideNavigator,
} from "../components";

export default function Home() {
  const [editorState, setEditorState] = useState("");
  const [bg, setBg] = useState("white");
  const [fontColor, setFontColor] = useState("black");

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
          <EditorPanel
            value={editorState}
            bgColor={bg}
            setBgColor={debounce((value: string) => setBg(value), 200)}
            fontColor={fontColor}
            setFontColor={debounce((value: string) => setFontColor(value), 200)}
            setValue={setEditorState}
          />
        </GridItem>
        <GridItem rowSpan={11} colSpan={2}>
          <PreviewSpace
            bgColor={bg}
            fontColor={fontColor}
            mdContent={editorState}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <SlideNavigator />
        </GridItem>
      </Grid>
    </div>
  );
}
