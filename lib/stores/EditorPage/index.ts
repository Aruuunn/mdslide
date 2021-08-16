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
  (
    slide: Slide,
    pid: string,
    idx: number,
    callback: (promise: Promise<any>) => void
  ) => {
    const promise = axios.patch(`/api/p/${pid}/slide`, {
      slides: slide,
      meta: { index: idx },
    });
    callback(promise);
  },
  300
);

type State = {
  currentSlideIdx: number;
  slides: Slide[];
  lastSlideUpdatePromise: Promise<void> | null;
  isSaving: boolean;
  isPresentationMode: boolean;
};

type Actions = {
  getCurrentSlide: () => Slide;
  goToSlide: (index: number) => void;
  updateCurrentSlide: (pid: string, map: MapToPartial<Slide>) => void;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  addNewSlide: () => void;
  setSlides: (slides: Slide[]) => void;
  startPresentationMode: () => void;
  stopPresentationMode: () => void;
};

export const useStore = create<State & Actions>((set, get) => ({
  currentSlideIdx: 0,
  slides: [defaultSlideValue],
  lastSlideUpdatePromise: null,
  isSaving: false,
  isPresentationMode: false,
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

    updateSlideRemote(slide, pid, currentSlideIdx, (promise) => {
      set({ lastSlideUpdatePromise: promise });

      promise.then(() => {
        const { lastSlideUpdatePromise } = get();
        if (lastSlideUpdatePromise === promise) {
          console.log("setting false");
          set({ isSaving: false });
        }
      });
    });

    set({
      slides: [
        ...slides.slice(0, currentSlideIdx),
        slide,
        ...slides.slice(currentSlideIdx + 1),
      ],
      isSaving: true,
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
  startPresentationMode: () => {
    set({ isPresentationMode: true });
  },
  stopPresentationMode: () => {
    set({ isPresentationMode: false });
  },
}));
