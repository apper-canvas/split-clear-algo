import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const GroupCard = ({ group, balance = 0, onClick }) => {
  const formatAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const getBalanceColor = () => {
    if (balance > 0) return "text-success";
    if (balance < 0) return "text-error";
    return "text-secondary";
  };

  const getBalanceText = () => {
    if (balance > 0) return "You are owed";
    if (balance < 0) return "You owe";
    return "Settled up";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card className="cursor-pointer" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-body font-semibold text-primary mb-1">
              {group.name}
            </h4>
            <p className="text-caption text-secondary mb-2">
              {group.members.length} members
            </p>
            <p className={`text-body font-medium ${getBalanceColor()}`}>
              {getBalanceText()}: {formatAmount(balance, group.currency)}
            </p>
          </div>
          <ApperIcon name="ChevronRight" size={24} className="text-secondary ml-4" />
        </div>
      </Card>
    </motion.div>
  );
};

export default GroupCard;