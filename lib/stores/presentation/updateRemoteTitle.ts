import axios from "axios";
import debounce from "debounce";
import createErrorToast from "lib/createErrorToast";

export const updateRemoteTitle = (pid: string) =>
  debounce((newTitle: string, callback: (promise: Promise<any>) => void) => {
    // TODO handle error.
    const promise = axios.patch(`/api/p/${pid}/title`, { title: newTitle });

    promise.catch(() => {
      createErrorToast("Error saving the title. Try again later");
    });

    callback(promise);
  }, 500);
