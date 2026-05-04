import { useEffect, useState } from "react";

export function useResponsiveScale(scales: {
  sm: number;
  md: number;
  lg: number;
}) {
  const [scale, setScale] = useState(scales.sm);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setScale(scales.lg);
      else if (window.innerWidth >= 768) setScale(scales.md);
      else setScale(scales.sm);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [scales.sm, scales.md, scales.lg]);

  return scale;
}
