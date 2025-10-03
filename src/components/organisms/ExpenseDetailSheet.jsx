import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import ContactChip from "@/components/molecules/ContactChip";
import { toast } from "react-toastify";
import expenseService from "@/services/api/expenseService";

const ExpenseDetailSheet = ({ expense, isOpen, onClose, onUpdate }) => {
  if (!expense) return null;

  const formatAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseService.delete(expense.Id);
        toast.success("Expense deleted successfully!");
        onUpdate?.();
        onClose();
      } catch (error) {
        toast.error("Failed to delete expense");
        console.error(error);
      }
    }
  };

  const handleSettle = async () => {
    try {
      await expenseService.settleExpense(expense.Id);
      toast.success("Expense marked as settled!");
      onUpdate?.();
      onClose();
    } catch (error) {
      toast.error("Failed to settle expense");
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-2xl bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-surface border-b border-secondary/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-h1 font-bold text-primary">Expense Details</h2>
              <motion.button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="X" size={20} className="text-secondary" />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-h1 font-bold text-primary mb-2">
                      {expense.description}
                    </h3>
                    <p className="text-body text-secondary">
                      {format(new Date(expense.date), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  {expense.settled && (
                    <Badge variant="success">
                      <ApperIcon name="CheckCircle" size={14} className="mr-1" />
                      Settled
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-xl">
                  <span className="text-body text-secondary">Total Amount</span>
                  <span className="text-h1 font-bold text-accent">
                    {formatAmount(expense.totalAmount, expense.currency)}
                  </span>
                </div>
              </Card>

              <div>
                <h4 className="text-body font-semibold text-primary mb-3">
                  Itemized Breakdown
                </h4>
                <div className="space-y-2">
                  {expense.items.map((item, index) => (
                    <Card key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-body font-medium text-primary">
                            {item.name}
                          </p>
                          <p className="text-caption text-secondary">
                            Qty: {item.quantity} × {formatAmount(item.price / item.quantity, expense.currency)}
                          </p>
                        </div>
                        <p className="text-body font-semibold text-primary">
                          {formatAmount(item.price, expense.currency)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.assignedTo.map((person) => (
                          <ContactChip
                            key={person}
                            name={person}
                            editable={false}
                          />
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-body font-semibold text-primary mb-3">
                  Split Details
                </h4>
                <Card>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-secondary/10">
                      <span className="text-body text-secondary">Paid by</span>
                      <span className="text-body font-semibold text-primary">
                        {expense.paidBy}
                      </span>
                    </div>
                    {Object.entries(expense.splits).map(([person, amount]) => (
                      <div key={person} className="flex items-center justify-between">
                        <span className="text-body text-primary">{person}</span>
                        <span className={`text-body font-semibold ${
                          person === "You" && expense.paidBy !== "You" 
                            ? "text-error" 
                            : person !== expense.paidBy 
                            ? "text-success" 
                            : "text-secondary"
                        }`}>
                          {person === "You" && expense.paidBy !== "You" && "owes "}
                          {person !== expense.paidBy && person !== "You" && "owes "}
                          {formatAmount(amount, expense.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="danger" onClick={handleDelete} className="flex-1">
                  <ApperIcon name="Trash2" size={18} />
                  Delete
                </Button>
                {!expense.settled && (
                  <Button variant="success" onClick={handleSettle} className="flex-1">
                    <ApperIcon name="CheckCircle" size={18} />
                    Mark Settled
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExpenseDetailSheet;