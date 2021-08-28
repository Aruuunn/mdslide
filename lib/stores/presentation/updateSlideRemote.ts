import axios from "axios";
import debounce from "debounce";
import Slide from "model/slide";
import createErrorToast from "lib/createErrorToast";

export const updateSlideRemote = debounce(
  (slide: Slide, pid: string, callback: (promise: Promise<any>) => void) => {
    const promise = axios.patch(`/api/p/${pid}/slide/${slide.id || "new"}`, {
      slide,
    });

    promise.then((res) => {
      if (slide.id === "") {
        const {
          data: { id },
        } = res;
        slide.id = id;
      }
    });

    promise.catch(() => {
      createErrorToast("Error saving the slide");
      // TODO set the icon to saving to unsaved
    });

    callback(promise);
  },
  300
);
