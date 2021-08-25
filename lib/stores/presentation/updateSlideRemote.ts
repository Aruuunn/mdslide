import axios from "axios";
import debounce from "debounce";
import Slide from "model/slide";

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
    callback(promise);
  },
  300
);
