import { ObjectId } from "mongodb";
import { FC, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Flex, Spacer, IconButton, Icon } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import PresentationInterface from "model/presentation";
import PresentationModel from "model/presentation";
import { useStore } from "lib/stores/presentation";
import { getDb } from "lib/db/getDb";
import { Logo, FullScreenPresentation, Slide, LoadFonts } from "components";
import { keyListeners } from "lib/setupKeyListeners";

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
  const startPresentationMode = store.startPresentationMode;

  const [constraint, setConstraint] = useState({ height: 1080, width: 1920 });

  const fontFamilies = slides.map((s) => s.fontFamily);

  useEffect(() => {
    const setScreenSize = () =>
      setConstraint({
        height: window.innerHeight - 200,
        width: window.innerWidth,
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
            <IconButton
              ml="20px"
              aria-label="present"
              onClick={startPresentationMode}
              bg="transparent"
              size="sm"
              icon={
                <Icon
                  height="30px"
                  viewBox="0 0 24 24"
                  width="30px"
                  fill="#495464"
                >
                  <g>
                    <rect fill="none" height="24" width="24" />
                    <path d="M19,3H5C3.89,3,3,3.9,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.11,3,19,3z M19,19H5V7h14V19z M13.5,13 c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5c0-0.83,0.67-1.5,1.5-1.5S13.5,12.17,13.5,13z M12,9c-2.73,0-5.06,1.66-6,4 c0.94,2.34,3.27,4,6,4s5.06-1.66,6-4C17.06,10.66,14.73,9,12,9z M12,15.5c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 c1.38,0,2.5,1.12,2.5,2.5C14.5,14.38,13.38,15.5,12,15.5z" />
                  </g>
                </Icon>
              }
            />
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="#f6f5f5"
            height="calc(100vh - 70px)"
          >
            <Flex
              as="button"
              aria-label="go to previous slide"
              mr="5"
              p="10px"
              bg="#fafafa"
              borderRadius="50%"
              height="36px"
              alignItems="center"
              justify="center"
              width="36px"
              boxShadow="base"
              aria-hidden={currentSlideIndex === 0}
              onClick={store.goToPrevSlide}
              disabled={currentSlideIndex === 0}
              _disabled={{ cursor: "not-allowed" }}
              color="#495464"
              _hover={{ boxShadow: "md" }}
              _focus={{ boxShadow: "md" }}
            >
              <ChevronLeftIcon w={6} h={6} />
            </Flex>

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

            <Flex
              as="button"
              aria-label="go to next slide"
              ml="5"
              p="10px"
              bg="#fafafa"
              borderRadius="50%"
              height="36px"
              alignItems="center"
              justify="center"
              width="36px"
              boxShadow="base"
              color="#495464"
              aria-hidden={currentSlideIndex === slides.length - 1}
              disabled={currentSlideIndex === slides.length - 1}
              _disabled={{ cursor: "not-allowed" }}
              onClick={store.goToNextSlide}
              _hover={{ boxShadow: "md" }}
              _focus={{ boxShadow: "md" }}
            >
              <ChevronRightIcon w={6} h={6} />
            </Flex>
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
