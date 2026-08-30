import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

export function MotionSection({ children, className = "", id, delay = 0 }: MotionSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 1, y: 30, scale: 0.99 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 30, scale: 0.99 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.section>
  );
}

interface MotionItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function MotionItem({ children, className = "", delay = 0, direction = "up", style, onClick, onMouseMove, onMouseLeave }: MotionItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px 0px" });

  const initialX = direction === "left" ? -35 : direction === "right" ? 35 : 0;
  const initialY = direction === "up" ? 25 : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: initialX, y: initialY }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

