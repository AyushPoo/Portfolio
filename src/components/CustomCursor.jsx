import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Springs for smoother movement
  const dotX = useSpring(0, { stiffness: 800, damping: 50 });
  const dotY = useSpring(0, { stiffness: 800, damping: 50 });
  const ringX = useSpring(0, { stiffness: 300, damping: 30 });
  const ringY = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const moveCursor = (e) => {
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
      ringX.set(e.clientX - 14); // Half of 28px width
      ringY.set(e.clientY - 14);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".project-card-wrap") ||
        target.closest("input") ||
        target.closest("textarea");

      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [dotX, dotY, ringX, ringY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="cursor-dot hidden lg:block"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        className={`cursor-ring hidden lg:block ${isHovering ? "hovering" : ""}`}
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: isHovering ? 1.4 : 1,
        }}
      />
    </>
  );
};

export default CustomCursor;
