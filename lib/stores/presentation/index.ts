import create from "zustand";

import Slide from "model/slide";
import { getTempId } from "lib/utils/getTempId";
import { updateSlideRemote } from "./updateSlideRemote";
import { updateRemoteTitle } from "./updateRemoteTitle";
import { deleteSlideRemote } from "./deleteSlide";
import { createInfoToast } from "lib/createInfoToast";
import type { Actions, State } from "./types";
import { createNewSlide } from "./createNewSlide";

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
  lastSaveRequestPromise: null,
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
    const { presentation, setLastSaveRequestPromise } = get();
    const { slides } = presentation;
    const pid = presentation.id;

    const idx = slides.findIndex((s) => s.id === id);

    if (idx === -1) return;

    const partialSlide = map(slides[idx]);

    const slide = { ...slides[idx], ...partialSlide };

    updateSlideRemote(slide, pid, setLastSaveRequestPromise);

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
    const { presentation, updateSlide, setLastSaveRequestPromise } = get();
    const { slides } = presentation;

    const lastSlide = slides[slides.length - 1];

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

    createNewSlide(
      newSlide,
      presentation.id,
      updateSlide,
      setLastSaveRequestPromise
    );
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
    const { presentation, isSaving, setLastSaveRequestPromise } = get();

    const isInvalid = !newTitle || newTitle?.trim() === "";

    set({
      presentation: { ...presentation, title: newTitle },
      isSaving: isSaving || !isInvalid,
    });

    if (isInvalid) {
      return;
    }

    updateRemoteTitle(presentation.id)(newTitle, setLastSaveRequestPromise);
  },
  deleteSlide: (id: string) => {
    const { presentation, setLastSaveRequestPromise } = get();

    const { slides, id: pid } = presentation;

    const idx = slides.findIndex((s) => s.id === id);

    if (idx === -1) {
      console.error("Tried deleting slide which is not present. ", id);
      return;
    }

    deleteSlideRemote(id, pid, setLastSaveRequestPromise);

    set({
      isSaving: true,
      presentation: {
        ...presentation,
        slides: slides.filter((s) => s.id !== id),
      },
    });
  },
  deleteCurrentSlide: () => {
    const {
      currentSlideIdx,
      presentation: { slides },
      deleteSlide,
    } = get();

    const id = slides[currentSlideIdx].id;

    if (slides.length === 1) {
      createInfoToast("You need to have atleast one slide");
      return;
    }

    if (!window.confirm("Do you really want to delete this slide?")) {
      return;
    }

    if (currentSlideIdx === slides.length - 1) {
      set({ currentSlideIdx: currentSlideIdx - 1 });
    }

    deleteSlide(id);
  },
  setLastSaveRequestPromise: (promise) => {
    const { lastSaveRequestPromise } = get();

    const combinedPromise = Promise.allSettled(
      [lastSaveRequestPromise, promise].filter(Boolean)
    );

    combinedPromise.finally(() => {
      const { lastSaveRequestPromise } = get();

      if (lastSaveRequestPromise === combinedPromise) {
        set({ lastSaveRequestPromise: null, isSaving: false });
      }
    });

    set({ lastSaveRequestPromise: combinedPromise, isSaving: true });
  },
}));

export default useStore;
