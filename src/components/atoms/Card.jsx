import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  hoverable = false,
  ...props 
}, ref) => {
  const Component = hoverable ? motion.div : "div";
  const hoverProps = hoverable ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        "bg-surface rounded-2xl shadow-card p-6",
        className
      )}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;