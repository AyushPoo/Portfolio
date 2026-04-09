import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — animates a number from 0 to `target` over `duration` ms
 * when `trigger` becomes true (e.g. from useScrollReveal).
 *
 * @param {number} target    The final number to count up to
 * @param {number} duration  Animation duration in ms (default 1800)
 * @param {boolean} trigger  Start the animation when this is true
 * @returns {number}         Current animated value
 */
export function useCountUp(target, duration = 1800, trigger = true) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    // easeOutExpo for a snappy deceleration feel
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [target, duration, trigger]);

  return count;
}
