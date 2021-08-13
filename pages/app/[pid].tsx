import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Head from "next/head";
import debounce from "debounce";
import { Grid, GridItem } from "@chakra-ui/react";

import {
  EditorPanel,
  Navbar,
  PreviewSpace,
  SlideNavigator,
} from "../../components";
import { Presentation } from "../../model/presentation";
import { getDb } from "../../lib/db";
import { ObjectId } from "mongodb";
import axios from "axios";

interface Slide {
  bgColor: string;
  fontColor: string;
  mdContent: string;
}

interface HomeProps {
  slides: Slide[];
  title: string;
  pid: string;
}

export function Home(props: HomeProps) {
  const { slides: intialSlides, pid, title } = props;

  const defaultSlideValue: Slide = {
    fontColor: "black",
    bgColor: "white",
    mdContent: "",
  };

  const [state, setState] = useState<{ currentSlide: number; slides: Slide[] }>(
    { currentSlide: 0, slides: intialSlides }
  );

  const { currentSlide, slides } = state;

  const updateCurrentSlide = (map: (slide: Slide) => Slide) => {
    setState((s) => {
      const slide = map(s.slides[s.currentSlide]);

      updateSlideRemote(slide, s.currentSlide);

      return {
        ...s,
        slides: [
          ...s.slides.slice(0, s.currentSlide),
          slide,
          ...s.slides.slice(s.currentSlide + 1),
        ],
      };
    });
  };

  const getCurrentSlide = (): Slide => slides[currentSlide];

  const goToSlide = (idx: number) => {
    setState((s) => ({
      ...s,
      currentSlide: idx,
    }));
  };

  const nextSlide = () => {
    setState((s) => ({
      ...s,
      currentSlide:
        s.slides.length !== s.currentSlide + 1
          ? s.currentSlide + 1
          : s.currentSlide,
    }));
  };

  const prevSlide = () => {
    setState((s) => ({
      ...s,
      currentSlide: s.currentSlide !== 0 ? s.currentSlide - 1 : s.currentSlide,
    }));
  };

  const updateSlideRemote = debounce(async (slide: Slide, idx: number) => {
    console.log({ idx, slide });
    await axios.patch(`/api/p/${pid}/slide`, {
      slides: slide,
      meta: { index: idx },
    });
  }, 300);

  useEffect(() => {
    window.onkeydown = (e) => {
      if (e.keyCode == 37) {
        prevSlide();
      } else if (e.keyCode == 39) {
        nextSlide();
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
            value={getCurrentSlide().mdContent}
            bgColor={getCurrentSlide().bgColor}
            setBgColor={debounce((value: string) => {
              updateCurrentSlide((s) => ({
                ...s,
                bgColor: value,
              }));
            }, 200)}
            fontColor={getCurrentSlide().fontColor}
            setFontColor={debounce((value: string) => {
              updateCurrentSlide((s) => ({
                ...s,
                fontColor: value,
              }));
            }, 200)}
            setValue={(value) => {
              updateCurrentSlide((s) => ({
                ...s,
                mdContent: value,
              }));
            }}
          />
        </GridItem>
        <GridItem rowSpan={11} colSpan={2}>
          <PreviewSpace
            bgColor={getCurrentSlide().bgColor}
            fontColor={getCurrentSlide().fontColor}
            mdContent={getCurrentSlide().mdContent}
          />
        </GridItem>
        <GridItem rowSpan={1} colSpan={2}>
          <SlideNavigator
            onAddNewSlide={() => {
              setState((s) => ({
                ...s,
                currentSlide: s.currentSlide + 1,
                slides: [...s.slides, { ...defaultSlideValue }],
              }));
            }}
            currentSlide={state.currentSlide}
            onClickSlide={goToSlide}
            slides={state.slides}
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

export default Home;
