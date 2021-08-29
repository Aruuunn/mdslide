import { isTempId } from "./../../utils/getTempId";
import axios from "axios";
import debounce from "debounce";
import Slide from "model/slide";
import createErrorToast from "lib/createErrorToast";

type MapToPartial<T> = (value: T) => Partial<T>;

const tempIds = new Set<string>();

// @TODO dont debounce new slide creation
const fn = (
  slide: Slide,
  pid: string,
  updateSlide: (id: string, map: MapToPartial<Slide>) => void,
  callback: (promise: Promise<any>) => void
) => {
  const sid = slide.id;

  if (isTempId(sid)) {
    if (tempIds.has(sid)) {
      return;
    } else {
      tempIds.add(sid);
    }
  }

  const promise = axios.patch(
    `/api/p/${pid}/slide/${isTempId(sid) ? "new" : sid}`,
    {
      slide,
    }
  );

  promise.then((res) => {
    if (isTempId(sid)) {
      console.debug("saving the new id");

      const {
        data: { id },
      } = res;

      updateSlide(sid, () => ({ id }));
    }
  });

  promise.catch(() => {
    if (isTempId(sid)) {
      tempIds.delete(sid);
    }

    createErrorToast("Error saving the slide");
    // TODO set the icon from saving to unsaved
  });

  callback(promise);
};

export const updateSlideRemote = debounce(fn, 300);
