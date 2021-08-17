type Size = { width: number; height: number };

const getHeight = (width: number) => (9 * width) / 16;

const getWidth = (height: number) => (16 * height) / 9;

export const getSlideSize = (constraint: Size): Size => {
  let { height, width } = constraint;

  if (getHeight(width) > height) {
    width = getWidth(height);
  } else {
    height = getHeight(width);
  }

  return { height, width };
};
