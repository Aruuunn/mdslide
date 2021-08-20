import { FC, useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Flex } from "@chakra-ui/react";
import { Slide as ISlide } from "model/slide";
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

  useEffect(() => {
    const setScreenSize = () =>
      setConstraint({ height: window.innerHeight, width: window.innerWidth });

    window.addEventListener("resize", setScreenSize);
    setScreenSize();

    window.onkeydown = (e) => {
      if (e.keyCode == 37) {
        setIdx((idx) => (idx > 0 ? idx - 1 : idx));
      } else if (e.keyCode == 39) {
        setIdx((idx) => (idx + 1 < slides.length ? idx + 1 : idx));
      }
    };
  }, []);

  return (
    <Flex alignItems="center" justifyContent="center" bg={currentSlide.bgColor}>
      <Slide
        constraintSize={constraint}
        mdContent={currentSlide.mdContent}
        bgColor={currentSlide.bgColor}
        fontColor={currentSlide.fontColor}
        height={constraint.height}
        width={constraint.width}
      />
    </Flex>
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
    { pubmeta: { slug } },
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
