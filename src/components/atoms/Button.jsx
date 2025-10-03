import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "medium",
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent text-surface hover:bg-accent/90 active:bg-accent/80",
    secondary: "border-2 border-accent text-accent hover:bg-accent/5 active:bg-accent/10",
    ghost: "text-accent hover:bg-accent/5 active:bg-accent/10",
    danger: "bg-error text-surface hover:bg-error/90 active:bg-error/80",
    success: "bg-success text-surface hover:bg-success/90 active:bg-success/80"
  };
  
  const sizes = {
    small: "px-4 py-2 text-caption min-h-[40px]",
    medium: "px-6 py-3 text-body min-h-[48px]",
    large: "px-8 py-4 text-h2 min-h-[56px]"
  };

  return (
    <motion.button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;