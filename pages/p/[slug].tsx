import { FC, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Flex, Spacer } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Slide as ISlide } from "model/slide";
import { Logo } from "components/Logo";
import { Presentation } from "model/presentation";
import Slide from "components/Slide";
import { getDb } from "lib/db";

import "@uiw/react-md-editor/dist/markdown-editor.css";
import "@uiw/react-markdown-preview/dist/markdown.css";

interface PageProps {
  slides: ISlide[];
}

const PublishedPresentationPage: FC<PageProps> = (props) => {
  const { slides } = props;

  const [idx, setIdx] = useState(0);
  const [constraint, setConstraint] = useState({ height: 1080, width: 1920 });

  const currentSlide = slides[idx];

  const nextSlide = () =>
    setIdx((idx) => (idx + 1 < slides.length ? idx + 1 : idx));

  const prevSlide = () => setIdx((idx) => (idx > 0 ? idx - 1 : idx));

  useEffect(() => {
    const setScreenSize = () =>
      setConstraint({
        height: window.innerHeight - 200,
        width: window.innerWidth,
      });

    window.addEventListener("resize", setScreenSize);
    setScreenSize();

    window.onkeydown = (e) => {
      if (e.keyCode == 37) {
        prevSlide();
      } else if (e.keyCode == 39) {
        nextSlide();
      }
    };
  }, []);

  return (
    <>
      <Flex as="nav" height="70px" alignItems="center" p="5" width="100%">
        <Logo fontSize="xl" />
        <Spacer />
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="center"
        bg="#F4F4F2"
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
          aria-hidden={idx === 0}
          onClick={prevSlide}
          opacity={idx !== 0 ? 1 : 0}
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
          aria-hidden={idx === slides.length - 1}
          opacity={idx !== slides.length - 1 ? 1 : 0}
          onClick={nextSlide}
          _hover={{ boxShadow: "md" }}
          _focus={{ boxShadow: "md" }}
        >
          <ChevronRightIcon w={6} h={6} />
        </Flex>
      </Flex>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const { query } = ctx;
  const { slug } = query as { slug: string };

  const db = await getDb();
  const collection = db.getCollection(Presentation);

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

  return {
    props: {
      slides: presentation.slides,
    },
  };
};

export default PublishedPresentationPage;
