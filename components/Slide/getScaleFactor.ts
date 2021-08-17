import { getSlideSize } from "./getSlideSize";

export const getScaleFactor = (constraint: {
  width: number;
  height: number;
}): number => {
  const { width } = getSlideSize(constraint);
  return width / 1920;
};
