import create from "zustand";

import Slide from "model/slide";
import Presentation from "model/interfaces/presentation";
import { getTempId } from "lib/utils/getTempId";
import { updateSlideRemote } from "./updateSlideRemote";
import { updateRemoteTitle } from "./updateRemoteTitle";

type MapToPartial<T> = (value: T) => Partial<T>;

type State = {
  currentSlideIdx: number;
  presentation: Pick<
    Presentation,
    "slides" | "isPublished" | "pubmeta" | "title"
  > &
    Partial<Pick<Presentation, "id">>;
  lastSlideUpdatePromise: Promise<any> | null;
  isSaving: boolean;
  isPresentationMode: boolean;
};

type Actions = {
  getCurrentSlide: () => Slide;
  goToSlide: (index: number) => void;
  updateSlide: (id: string, map: MapToPartial<Slide>) => void;
  updateCurrentSlide: (map: MapToPartial<Slide>) => void;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
  addNewSlide: () => void;
  setPresentation: (presentation: Presentation) => void;
  startPresentationMode: () => void;
  stopPresentationMode: () => void;
  updateTitle: (newTitle: string) => void;
};

const defaultSlideValue: Slide = {
  id: "",
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
  updateSlide: (id: string, map: (slide: Slide) => Partial<Slide>) => {
    const { presentation, updateSlide } = get();
    const { slides } = presentation;
    const pid = presentation.id;

    const idx = slides.findIndex((s) => s.id === id);

    if (idx === -1) return;

    const partialSlide = map(slides[idx]);

    const slide = { ...slides[idx], ...partialSlide };

    updateSlideRemote(slide, pid, updateSlide, (promise) => {
      set({ lastSlideUpdatePromise: promise });

      promise.finally(() => {
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
    const {
      currentSlideIdx,
      updateSlide,
      presentation: { slides },
    } = get();

    updateSlide(slides[currentSlideIdx].id, map);
  },
  addNewSlide: () => {
    const { presentation, updateSlide } = get();
    const { slides } = presentation;

    const lastSlide = slides[slides.length - 1];

    // TODO
    const newSlide = {
      id: getTempId(),
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

    updateSlide(newSlide.id, (s) => s);
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
  updateTitle: (newTitle: string) => {
    const { presentation, isSaving } = get();

    const isInvalid = !newTitle || newTitle?.trim() === "";

    set({
      presentation: { ...presentation, title: newTitle },
      isSaving: isSaving || !isInvalid,
    });

    if (isInvalid) {
      return;
    }

    updateRemoteTitle(presentation.id)(newTitle, (promise) => {
      const { lastSlideUpdatePromise } = get();
      const combinedPromise = Promise.allSettled(
        [promise, lastSlideUpdatePromise].filter(Boolean)
      );

      combinedPromise.finally(() => {
        const { lastSlideUpdatePromise } = get();
        if (lastSlideUpdatePromise === combinedPromise) {
          set({ isSaving: false, lastSlideUpdatePromise: null });
        }
      });

      // @TODO change name to generalize.
      set({ lastSlideUpdatePromise: combinedPromise });
    });
  },
}));

export default useStore;
