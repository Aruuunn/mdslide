import axios from "axios";
import create from "zustand";
import { debounce } from "debounce";
import { Slide } from "@model/slide";

type MapToPartial<T> = (value: T) => Partial<T>;

const defaultSlideValue: Slide = {
  fontColor: "black",
  bgColor: "white",
  mdContent: "# Type Something..",
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

export const useStore = create<State & Actions>((set, get) => ({
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
    const { slides } = get();

    const lastSlide = slides[slides.length - 1];

    set({
      currentSlideIdx: slides.length,
      slides: [
        ...slides,
        {
          ...defaultSlideValue,
          bgColor: lastSlide?.bgColor ?? "white",
          fontColor: lastSlide?.fontColor ?? "black",
        },
      ],
    });
  },
  setSlides: (slides) => {
    set({ slides });
  },
}));
