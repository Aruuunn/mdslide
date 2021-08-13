import { BadRequestException } from "lib/exceptions/common";
import { patchFieldApi } from "@lib/patch-field";

export default patchFieldApi("title", (newTitle) => {
  if (typeof newTitle !== "string" || newTitle.trim().length === 0) {
    throw new BadRequestException("title is required");
  }

  return {
    $set: {
      title: newTitle,
    },
  };
});
