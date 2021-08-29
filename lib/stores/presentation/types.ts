import Presentation from "model/interfaces/presentation";
import Slide from "model/slide";

export type MapToPartial<T> = (value: T) => Partial<T>;

export type State = {
  currentSlideIdx: number;
  presentation: Pick<
    Presentation,
    "slides" | "isPublished" | "pubmeta" | "title"
  > &
    Partial<Pick<Presentation, "id">>;
  lastSaveRequestPromise: Promise<any> | null;
  isSaving: boolean;
  isPresentationMode: boolean;
};

export type Actions = {
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
  deleteSlide: (id: string) => void;
  deleteCurrentSlide: () => void;
  setLastSaveRequestPromise: (promise: Promise<any> | null) => void;
};
