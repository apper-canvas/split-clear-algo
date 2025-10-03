import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const BalanceCard = ({ label, amount, currency = "INR", variant = "default", onClick }) => {
  const variants = {
    default: "border-l-4 border-secondary",
    owe: "border-l-4 border-error",
    owed: "border-l-4 border-success"
  };

  const textColors = {
    default: "text-primary",
    owe: "text-error",
    owed: "text-success"
  };

  const formatAmount = (amt) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amt));
  };

  return (
    <motion.div
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <Card 
        className={cn("cursor-pointer", variants[variant])}
        onClick={onClick}
      >
        <p className="text-caption text-secondary mb-2 font-medium">{label}</p>
        <motion.p 
          className={cn("text-balance font-bold font-display", textColors[variant])}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          {formatAmount(amount)}
        </motion.p>
      </Card>
    </motion.div>
  );
};

export default BalanceCard;