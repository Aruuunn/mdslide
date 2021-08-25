import type { Size } from "./Size";

export const getConstraint = (): Size => {
  if (typeof window === "undefined") return { width: 0, height: 0 };

  const element = window.document.querySelector("#preview-space");
  if (element) {
    return {
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    };
  }
  return { width: 0, height: 0 };
};
