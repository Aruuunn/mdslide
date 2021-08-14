import { useEffect } from "react";
import axios from "axios";
import create from "zustand";
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

interface HomeProps {
  slides: Slide[];
  title: string;
  pid: string;
}

const defaultSlideValue: Slide = {
  fontColor: "black",
  bgColor: "white",
  mdContent: "",
};

const updateSlideRemote = debounce(
  async (slide: Slide, pid: string, idx: number) => {
    await axios.patch(`/api/p/${pid}/slide`, {
      slides: slide,
      meta: { index: idx },
    });
  },
  300
);

type MapToPartial<T> = (value: T) => Partial<T>;

type State = {
  currentSlideIdx: number;
  slides: Slide[];
};

type Actions = {
  getCurrentSlide: () => Slide;
  goToSlide: (index: number) => void;
  updateCurrentSlide: (pid: string, map: MapToPartial<Slide>) => void;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  addNewSlide: () => void;
  setSlides: (slides: Slide[]) => void;
};

const useStore = create<State & Actions>((set, get) => ({
  currentSlideIdx: 0,
  slides: [defaultSlideValue],
  getCurrentSlide: () => get().slides[get().currentSlideIdx],
  goToSlide: (index: number) => {
    const { slides } = get();

    if (index >= slides.length || index < 0) return;

    set({ currentSlideIdx: index });
  },
  goToNextSlide: () => {
    const { goToSlide, currentSlideIdx } = get();
    goToSlide(currentSlideIdx + 1);
  },
  goToPrevSlide: () => {
    const { goToSlide, currentSlideIdx } = get();
    goToSlide(currentSlideIdx - 1);
  },
  updateCurrentSlide: (pid: string, map: (slide: Slide) => Partial<Slide>) => {
    const { currentSlideIdx, slides } = get();

    const partialSlide = map(slides[currentSlideIdx]);

    const slide = { ...slides[currentSlideIdx], ...partialSlide };

    updateSlideRemote(slide, pid, currentSlideIdx);

    set({
      slides: [
        ...slides.slice(0, currentSlideIdx),
        slide,
        ...slides.slice(currentSlideIdx + 1),
      ],
    });
  },
  addNewSlide: () => {
    const { currentSlideIdx, slides } = get();

    set({
      currentSlideIdx: currentSlideIdx + 1,
      slides: [...slides, { ...defaultSlideValue }],
    });
  },
  setSlides: (slides) => {
    set({ slides });
  },
}));

export function Home(props: HomeProps) {
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

export default Home;
