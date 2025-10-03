import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

function GroupCard({ group, balance = 0, onClick = () => {} }) {
  function formatAmount(amount, currency = 'INR') {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  }

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
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
    >
      <Card>
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
}

export default GroupCard;