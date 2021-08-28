import { isTempId } from "./../../utils/getTempId";
import axios from "axios";
import debounce from "debounce";
import Slide from "model/slide";
import createErrorToast from "lib/createErrorToast";

type MapToPartial<T> = (value: T) => Partial<T>;

const tempIds = new Set<string>();

const fn = (
  slide: Slide,
  pid: string,
  updateSlide: (id: string, map: MapToPartial<Slide>) => void,
  callback: (promise: Promise<any>) => void
) => {
  if (isTempId(slide.id)) {
    if (tempIds.has(slide.id)) {
      return;
    } else {
      tempIds.add(slide.id);
    }
  }

  const promise = axios.patch(
    `/api/p/${pid}/slide/${isTempId(slide.id) ? "new" : slide.id}`,
    {
      slide,
    }
  );

  promise.then((res) => {
    if (isTempId(slide.id)) {
      const {
        data: { id },
      } = res;

      updateSlide(slide.id, () => ({ id }));
    }
  });

  promise.catch(() => {
    if (isTempId(slide.id)) {
      tempIds.delete(slide.id);
    }

    createErrorToast("Error saving the slide");
    // TODO set the icon from saving to unsaved
  });

  callback(promise);
};

export const updateSlideRemote = debounce(fn, 300);
