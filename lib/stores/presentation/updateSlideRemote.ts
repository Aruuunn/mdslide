import axios from "axios";
import debounce from "debounce";
import Slide from "model/slide";
import createErrorToast from "lib/createErrorToast";

export const updateSlideRemote = debounce(
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

    promise.catch(() => {
      createErrorToast("Error saving the slide");
      // TODO set the icon to saving to unsaved
    });

    callback(promise);
  },
  300
);
