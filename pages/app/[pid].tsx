import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Head from "next/head";
import debounce from "debounce";
import { Grid, GridItem } from "@chakra-ui/react";

import { EditorPanel, Navbar, PreviewSpace, SlideNavigator } from "components";
import { Presentation } from "model/presentation";
import { getDb } from "lib/db";
import { ObjectId } from "mongodb";
import { Slide } from "@model/slide";
import { useStore } from "lib/stores/EditorPage";

interface EditorPageProps {
  slides: Slide[];
  title: string;
  pid: string;
}

export function EditorPage(props: EditorPageProps) {
  const { slides: initialSlides, pid, title } = props;

  const store = useStore();
  const currentSlide = store.slides[store.currentSlideIdx];

  const getUpdateCurrentSlideFn = (
    field: keyof Slide,
    shouldDebounce = false
  ) => {
    const updateFn = (value: string) =>
      store.updateCurrentSlide(pid, () => ({ [field]: value }));

    if (shouldDebounce) {
      return debounce(updateFn, 300);
    }

    return updateFn;
  };

  const updateBgColor = getUpdateCurrentSlideFn("bgColor", true);
  const updateFontColor = getUpdateCurrentSlideFn("fontColor", true);
  const updateMdContent = getUpdateCurrentSlideFn("mdContent");

  useEffect(() => {
    store.setSlides(initialSlides);

    window.onkeydown = (e) => {
      if (typeof window !== "undefined") {
        const editorEl = window.document.querySelector<HTMLTextAreaElement>(
          ".w-md-editor-text-input"
        );

        if (window.document.activeElement === editorEl) {
          return;
        }
      }

      if (e.keyCode == 37) {
        store.goToPrevSlide();
      } else if (e.keyCode == 39) {
        store.goToNextSlide();
      }
    };
  }, []);

  return (
    <div>
      <Head>
        <title>MSLIDE</title>
      </Head>
      <Navbar title={title} pid={pid} />
      <Grid
        height={"calc(100vh - 70px)"}
        templateRows="repeat(12, 1fr)"
        templateColumns="repeat(3, 1fr)"
        as="main"
      >
        <GridItem rowSpan={12} colSpan={1}>
          <EditorPanel
            value={currentSlide.mdContent}
            bgColor={currentSlide.bgColor}
            setBgColor={updateBgColor}
            fontColor={currentSlide.fontColor}
            setFontColor={updateFontColor}
            setValue={updateMdContent}
          />
        </GridItem>
        <GridItem rowSpan={11} colSpan={2}>
          <PreviewSpace
            bgColor={currentSlide.bgColor}
            fontColor={currentSlide.fontColor}
            mdContent={currentSlide.mdContent}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <SlideNavigator
            onAddNewSlide={store.addNewSlide}
            currentSlide={store.currentSlideIdx}
            onClickSlide={store.goToSlide}
            slides={store.slides}
          />
        </GridItem>
      </Grid>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res, params } = ctx;
    const pid = params["pid"];

    const { user } = getSession(req, res);

    const db = await getDb();

    const collection = db.getCollection(Presentation);

    const presentation = await collection.findOne<Presentation>({
      userEmail: user.email,
      _id: new ObjectId(pid as string),
    });

    if (!presentation) {
      return {
        redirect: {
          destination: "/not-found",
          permanent: false,
        },
      };
    }

    return {
      props: {
        slides: presentation.slides.map((s) => ({ ...s })),
        title: presentation.title,
        pid,
      },
    };
  },
});

export default EditorPage;
