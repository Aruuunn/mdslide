import create from "zustand";
import Slide from "model/slide";
import Presentation from "model/interfaces/presentation";
import { updateSlideRemote } from "./updateSlideRemote";

type MapToPartial<T> = (value: T) => Partial<T>;

type State = {
  currentSlideIdx: number;
  presentation: Pick<
    Presentation,
    "slides" | "isPublished" | "pubmeta" | "title"
  > &
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
  updateLocalTitle: (newTitle: string) => void;
};

const defaultSlideValue: Slide = {
  fontColor: "black",
  bgColor: "white",
  mdContent: "# Slide",
  fontFamily: "Inter",
};

export const useStore = create<State & Actions>((set, get) => ({
  currentSlideIdx: 0,
  presentation: {
    slides: [defaultSlideValue],
    isPublished: false,
    title: "Untitled",
  },
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

    const newSlide = {
      mdContent: `# Slide ${slides.length + 1} \n`,
      bgColor: lastSlide?.bgColor ?? "white",
      fontColor: lastSlide?.fontColor ?? "black",
      fontFamily: lastSlide?.fontFamily ?? "Inter",
    };

    set({
      currentSlideIdx: slides.length,
      presentation: {
        ...presentation,
        slides: [...slides, newSlide],
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
  updateLocalTitle: (newTitle: string) => {
    const { presentation } = get();
    set({ presentation: { ...presentation, title: newTitle } });
  },
}));

export default useStore;
