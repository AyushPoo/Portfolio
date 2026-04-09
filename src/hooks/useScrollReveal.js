import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — returns a [ref, isVisible] pair.
 * Attach `ref` to any element; `isVisible` flips to true once
 * it enters the viewport (fires once, stays true).
 *
 * @param {number} threshold  0–1, how much of the element must be visible
 * @param {string} rootMargin CSS margin to extend/shrink the viewport
 */
export function useScrollReveal(threshold = 0.12, rootMargin = "0px 0px -60px 0px") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // fire once, then stop watching
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}
