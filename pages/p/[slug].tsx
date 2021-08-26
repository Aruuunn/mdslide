import { ObjectId } from "mongodb";
import { FC, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Flex, Spacer } from "@chakra-ui/react";

import PresentationInterface from "model/presentation";
import PresentationModel from "model/presentation";
import { useStore } from "lib/stores/presentation";
import { getDb } from "lib/db/getDb";
import {
  Logo,
  FullScreenPresentation,
  Slide,
  LoadFonts,
  NextSlideButton,
  PrevSlideButton,
  StartPresentationModeButton,
} from "components";
import { keyListeners } from "@lib/setupKeyListeners";

import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";

interface PageProps {
  presentation: PresentationInterface;
}

const PublishedPresentationPage: FC<PageProps> = (props) => {
  const { presentation } = props;

  const store = useStore();
  const slides = store.presentation.slides;
  const currentSlideIndex = store.currentSlideIdx;
  const currentSlide = slides[currentSlideIndex];

  const IsPresentationMode = store.isPresentationMode;

  const [constraint, setConstraint] = useState({ height: 1080, width: 1920 });

  const fontFamilies = slides.map((s) => s.fontFamily);

  useEffect(() => {
    const setScreenSize = () =>
      setConstraint({
        height: window.innerHeight - 200,
        width: window.innerWidth - 100,
      });

    window.addEventListener("resize", setScreenSize);
    setScreenSize();

    store.setPresentation(presentation);

    const { cleanUp, setUpKeyListener } = keyListeners();

    setUpKeyListener();

    return cleanUp;
  }, []);

  return (
    <>
      {!IsPresentationMode ? (
        <>
          <LoadFonts fontFamilies={fontFamilies} />
          <Flex
            as="nav"
            height="70px"
            alignItems="center"
            p="5"
            width="100%"
            borderWidth="1px"
            borderColor="#e2e8f0"
          >
            <Logo fontSize="xl" />
            <Spacer />
            <StartPresentationModeButton ml="20px" />
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="#f6f5f5"
            height="calc(100vh - 70px)"
          >
            <PrevSlideButton />

            <Slide
              constraintSize={constraint}
              mdContent={currentSlide.mdContent}
              bgColor={currentSlide.bgColor}
              fontColor={currentSlide.fontColor}
              height={constraint.height}
              fontFamily={currentSlide.fontFamily}
              width={constraint.width}
              boxShadow="lg"
            />

            <NextSlideButton />
          </Flex>
        </>
      ) : (
        <FullScreenPresentation />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const { slug } = query as { slug: string };

  const db = await getDb();
  const collection = db.getCollection(PresentationModel);

  const presentation = await collection.findOne(
    { pubmeta: { slug }, isPublished: true },
    { projection: { slides: 1 } }
  );

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

  const props: PageProps = {
    presentation: { ...payload, id: _id.toHexString() },
  };

  return {
    props,
  };
};

export default PublishedPresentationPage;
