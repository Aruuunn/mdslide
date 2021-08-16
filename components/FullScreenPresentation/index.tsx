import { FC, useEffect } from "react";
import { Slide } from "../Slide";
import { useStore } from "lib/stores/EditorPage";

export interface FullScreenPresentationProps {}

export const FullScreenPresentation: FC<FullScreenPresentationProps> = (
  props
) => {
  const store = useStore();
  const currentSlide = store.slides[store.currentSlideIdx];

  useEffect(() => {
    document.body.onfullscreenchange = () => {
      if (document.fullscreenElement !== document.body) {
        store.stopPresentationMode();
      }
    };

    document.body.requestFullscreen();

    window.onkeydown = (e) => {
      switch (e.key) {
        case "Escape":
          store.stopPresentationMode();
          break;
        case "ArrowLeft":
          store.goToPrevSlide();
          break;
        case "ArrowRight":
          store.goToNextSlide();
          break;
      }
    };
  }, []);

  return (
    <Slide
      bgColor={currentSlide.bgColor}
      fontColor={currentSlide.fontColor}
      mdContent={currentSlide.mdContent}
      height={window.screen.height}
      width={window.screen.width}
    />
  );
};
