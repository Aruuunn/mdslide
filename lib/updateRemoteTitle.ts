import axios from "axios";
import debounce from "debounce";

export const updateRemoteForId = (pid: string) =>
  debounce(async (newTitle: string) => {
    // TODO handle error.
    await axios.patch(`/api/p/${pid}/title`, { title: newTitle });
  }, 500);
