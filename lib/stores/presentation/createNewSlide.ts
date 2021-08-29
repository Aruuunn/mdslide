import axios from "axios";
import Slide from "model/slide";
import createErrorToast from "lib/createErrorToast";
import type { MapToPartial } from "./types";
import { isTempId } from "lib/utils/getTempId";

export const createNewSlide = (
  slide: Slide,
  pid: string,
  updateSlide: (id: string, map: MapToPartial<Slide>) => void,
  callback: (promise: Promise<any>) => void
) => {
  const sid = slide.id;

  if (!isTempId(slide.id)) {
    console.error(
      "new slide should have temporary id before saving it at remote. got ",
      slide.id
    );
    return;
  }

  const promise = axios.post(`/api/p/${pid}/slide/new`, {
    slide,
  });

  promise.then((res) => {
    const {
      data: { id },
    } = res;

    if (typeof id === "string") {
      updateSlide(sid, () => ({ id }));
    } else {
      console.error("expected id of type string from the api. got ", id);
    }
  });

  promise.catch(() => {
    createErrorToast("Error saving the slide");
  });

  callback(promise);
};
