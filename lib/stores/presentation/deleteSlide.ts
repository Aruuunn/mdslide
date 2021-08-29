import axios from "axios";
import { createErrorToast } from "lib/createErrorToast";
import debounce from "debounce";

export const deleteSlideRemote = debounce(
  (sid: string, pid: string, callback: (promise: Promise<any>) => void) => {
    const promise = axios.delete(`/api/p/${pid}/slide/${sid}`);

    promise.catch((e) => {
      console.error(e);
      createErrorToast("Error deleting the slide.");
    });

    callback(promise);
  }
);
