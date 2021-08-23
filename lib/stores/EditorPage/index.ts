import { Presentation } from "model/interfaces/presentation";
import axios from "axios";
import create from "zustand";
import { debounce } from "debounce";
import { Slide } from "@model/slide";

type MapToPartial<T> = (value: T) => Partial<T>;

const defaultSlideValue: Slide = {
  fontColor: "black",
  bgColor: "white",
  mdContent: "# Type Something..",
  fontFamily: "Inter",
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
  presentation: Pick<Presentation, "slides" | "isPublished" | "pubmeta"> &
    Partial<Pick<Presentation, "id">>;
  lastSlideUpdatePromise: Promise<void> | null;
  isSaving: boolean;
  isPresentationMode: boolean;
};

type Actions = {
  getCurrentSlide: () => Slide;
  goToSlide: (index: number) => void;
  updateSlide: (idx: number, map: MapToPartial<Slide>) => void;
  updateCurrentSlide: (map: MapToPartial<Slide>) => void;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  addNewSlide: () => void;
  setPresentation: (presentation: Presentation) => void;
  startPresentationMode: () => void;
  stopPresentationMode: () => void;
};

export const useStore = create<State & Actions>((set, get) => ({
  currentSlideIdx: 0,
  presentation: { slides: [defaultSlideValue], isPublished: false },
  lastSlideUpdatePromise: null,
  isSaving: false,
  isPresentationMode: false,
  getCurrentSlide: () => get().presentation.slides[get().currentSlideIdx],
  goToSlide: (index: number) => {
    const {
      presentation: { slides },
    } = get();

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
  updateSlide: (idx: number, map: (slide: Slide) => Partial<Slide>) => {
    const { presentation } = get();
    const { slides } = presentation;
    const pid = presentation.id;

    const partialSlide = map(slides[idx]);

    const slide = { ...slides[idx], ...partialSlide };

    updateSlideRemote(slide, pid, idx, (promise) => {
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
      presentation: {
        ...presentation,
        slides: [...slides.slice(0, idx), slide, ...slides.slice(idx + 1)],
      },
      isSaving: true,
    });
  },
  updateCurrentSlide: (map: (slide: Slide) => Partial<Slide>) => {
    const { currentSlideIdx, updateSlide } = get();

    updateSlide(currentSlideIdx, map);
  },
  addNewSlide: () => {
    const { presentation, updateSlide } = get();
    const { slides } = presentation;

    const lastSlide = slides[slides.length - 1];

    set({
      currentSlideIdx: slides.length,
      presentation: {
        ...presentation,
        slides: [
          ...slides,
          {
            mdContent: `# Slide ${slides.length + 1} \n`,
            bgColor: lastSlide?.bgColor ?? "white",
            fontColor: lastSlide?.fontColor ?? "black",
            fontFamily: lastSlide?.fontFamily ?? "Inter",
          },
        ],
      },
    });

    updateSlide(slides.length, (s) => s);
  },
  setPresentation: (presentation) => {
    set({ presentation });
  },
  startPresentationMode: () => {
    set({ isPresentationMode: true });
  },
  stopPresentationMode: () => {
    set({ isPresentationMode: false });
  },
}));
