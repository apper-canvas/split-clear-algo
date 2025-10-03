import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ContactChip = ({ name, amount, currency = "INR", onRemove, editable = true }) => {
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatAmount = (amt) => {
    if (!amt) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(amt);
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 bg-accent/10 rounded-full",
        editable && "pr-2"
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
        <span className="text-[10px] font-bold text-surface">
          {getInitials(name)}
        </span>
      </div>
      <span className="text-caption font-medium text-primary">
        {name}
        {amount && (
          <span className="ml-1 text-accent font-semibold">
            {formatAmount(amount)}
          </span>
        )}
      </span>
      {editable && onRemove && (
        <motion.button
          onClick={onRemove}
          className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon name="X" size={12} className="text-secondary" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default ContactChip;