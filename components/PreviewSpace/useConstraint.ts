import { useEffect, useState } from "react";

import type { Size } from "./Size";
import { untilAsync } from "./untilAsync";
import { getConstraint } from "./getConstraint";

export function useConstraint(): Size {
  const [constraint, setConstraint] = useState<Size>(getConstraint);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", () => {
        setConstraint(getConstraint);
      });

      untilAsync(
        () => setConstraint(getConstraint),
        () => constraint.width !== 0,
        500
      );
    }
  }, []);

  return constraint;
}

export default useConstraint;
