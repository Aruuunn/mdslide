import axios from "axios";
import debounce from "debounce";
import Slide from "model/slide";
import createErrorToast from "lib/createErrorToast";
import { isTempId } from "lib/utils/getTempId";

export const updateSlideRemote = debounce(
  (slide: Slide, pid: string, callback: (promise: Promise<any>) => void) => {
    const sid = slide.id;

    if (isTempId(sid)) {
      return;
    }

    const promise = axios.patch(`/api/p/${pid}/slide/${sid}`, {
      slide,
    });

    promise.catch(() => {
      createErrorToast("Error saving the slide");
      // TODO set the icon from saving to unsaved
    });

    callback(promise);
  },
  300
);
