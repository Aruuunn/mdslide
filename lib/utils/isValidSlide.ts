import { Slide } from "model/slide";

function isString(s: any): boolean {
  return typeof s === "string";
}

export function isValidSlide(s: any): s is Slide {
  return (
    isString(s?.mdContent) && isString(s?.bgColor) && isString(s?.fontColor)
  );
}
