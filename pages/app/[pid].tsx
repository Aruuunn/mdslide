import Head from "next/head";
import debounce from "debounce";
import { useEffect } from "react";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Grid, GridItem } from "@chakra-ui/react";

import PresentationModel from "model/presentation";
import PresentationType from "model/interfaces/presentation";
import {
  EditorPanel,
  EditorNavbar,
  PreviewSpace,
  SlideNavigator,
  FullScreenPresentation,
} from "components";
import { getDb } from "lib/db/getDb";
import { Slide } from "model/slide";
import { useStore } from "lib/stores/presentation";
import { keyListeners } from "lib/setupKeyListeners";
import { mapUnderscoreIdToId } from "@lib/utils/mapUnderscoreId";

interface EditorPageProps {
  presentation: PresentationType;
  pid: string;
}

export function EditorPage(props: EditorPageProps) {
  const { presentation } = props;

  const store = useStore();
  const slides = useStore((state) => state.presentation.slides);
  const currentSlide = slides[store.currentSlideIdx];

  const getUpdateCurrentSlideFn = (
    field: keyof Slide,
    shouldDebounce = false
  ) => {
    const updateFn = (value: string) =>
      store.updateCurrentSlide(() => ({ [field]: value }));

    if (shouldDebounce) {
      return debounce(updateFn, 300);
    }

    return updateFn;
  };

  const updateBgColor = getUpdateCurrentSlideFn("bgColor", true);
  const updateFontColor = getUpdateCurrentSlideFn("fontColor", true);
  const updateMdContent = getUpdateCurrentSlideFn("mdContent");
  const updateFontFamily = getUpdateCurrentSlideFn("fontFamily");

  useEffect(() => {
    store.setPresentation(presentation);

    const { cleanUp, setUpKeyListener } = keyListeners();

    setUpKeyListener();

    return cleanUp;
  }, []);

  return (
    <>
      <Head>
        <title>{presentation.title}</title>
      </Head>
      {!store.isPresentationMode ? (
        <>
          <EditorNavbar />
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
                fontFamily={currentSlide.fontFamily}
                setFontFamily={updateFontFamily}
              />
            </GridItem>
            <GridItem rowSpan={11} colSpan={2}>
              <PreviewSpace
                fontFamily={currentSlide.fontFamily}
                bgColor={currentSlide.bgColor}
                fontColor={currentSlide.fontColor}
                mdContent={currentSlide.mdContent}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
              <SlideNavigator onClickSlide={store.goToSlide} />
            </GridItem>
          </Grid>{" "}
        </>
      ) : (
        <FullScreenPresentation />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res, params } = ctx;
    const pid = params["pid"];

    const { user } = getSession(req, res);

    const db = await getDb();

    const collection = db.getCollection(PresentationModel);

    const presentation = await collection.findOne<PresentationModel>({
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

    const { _id, ...payload } = presentation as PresentationModel & {
      _id: ObjectId;
    };

    const props: EditorPageProps = {
      presentation: {
        ...payload,
        id: _id.toHexString(),
        slides: payload.slides.map(mapUnderscoreIdToId),
      },
      pid: pid as string,
    };

    return {
      props,
    };
  },
});

export default EditorPage;
