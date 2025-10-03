import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  label,
  error,
  className,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-body font-medium text-primary mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 bg-surface border-2 border-secondary/30 rounded-xl text-body text-primary placeholder:text-secondary/50",
          "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
          "transition-all min-h-[48px]",
          error && "border-error focus:border-error focus:ring-error/20",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-caption text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;