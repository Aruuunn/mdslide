import { BadRequestException } from "lib/exceptions/common";
import { Slide } from "model/slide";
import { patchFieldApi } from "lib/patch-field";
import { isValidSlide } from "lib/utils/isValidSlide";

export default patchFieldApi("slides", (slide: Slide, meta) => {
  if (typeof meta?.index !== "number") {
    throw new BadRequestException("index required");
  }

  if (!isValidSlide(slide)) {
    throw new BadRequestException("invalid slide");
  }

  return {
    $set: {
      [`slides.${meta.index}`]: slide,
    },
  };
});
