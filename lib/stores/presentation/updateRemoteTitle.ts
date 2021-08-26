import axios from "axios";
import debounce from "debounce";

export const updateRemoteForId = (pid: string) =>
  debounce((newTitle: string, callback: (promise: Promise<any>) => void) => {
    // TODO handle error.
    const promise = axios.patch(`/api/p/${pid}/title`, { title: newTitle });
    callback(promise);
  }, 500);
