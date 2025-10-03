import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ExpenseItem = ({ expense, onClick }) => {
  const formatAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getYourShare = () => {
    return expense.splits["You"] || 0;
  };

  const yourShare = getYourShare();
  const isPayer = expense.paidBy === "You";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card className="cursor-pointer" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="text-body font-semibold text-primary mb-1">
              {expense.description}
            </h4>
            <p className="text-caption text-secondary">
              Paid by {expense.paidBy} • {format(new Date(expense.date), "MMM d, yyyy")}
            </p>
          </div>
          <div className="text-right ml-4">
            <p className="text-h2 font-bold text-primary">
              {formatAmount(expense.totalAmount, expense.currency)}
            </p>
            {!isPayer && yourShare > 0 && (
              <p className="text-caption text-error mt-1">
                You owe: {formatAmount(yourShare, expense.currency)}
              </p>
            )}
          </div>
        </div>
<div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {expense.category && (
              <Badge variant="info">
                <ApperIcon name="Tag" size={12} className="mr-1" />
                {expense.category}
              </Badge>
            )}
            {expense.items.length > 1 && (
              <Badge variant="info">
                <ApperIcon name="List" size={12} className="mr-1" />
                {expense.items.length} items
              </Badge>
            )}
            {expense.settled && (
              <Badge variant="success">
                <ApperIcon name="CheckCircle" size={12} className="mr-1" />
                Settled
              </Badge>
            )}
          </div>
          <ApperIcon name="ChevronRight" size={20} className="text-secondary" />
        </div>
      </Card>
    </motion.div>
  );
};

export default ExpenseItem;