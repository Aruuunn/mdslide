import { Slide } from "model/slide";
import { patchFieldApi } from "lib/patch-field";

// @TODO check validity of slide
export default patchFieldApi("slides", (slide: Slide, meta) => {
  if (typeof meta?.index !== "number") {
    throw new Error("index required");
  }

  return {
    $set: {
      [`slides.${meta.index}`]: slide,
    },
  };
});
