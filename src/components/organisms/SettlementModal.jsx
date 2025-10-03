import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { toast } from "react-toastify";
import balanceService from "@/services/api/balanceService";
import settlementService from "@/services/api/settlementService";

const SettlementModal = ({ balance, isOpen, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!balance) return null;

  const formatAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "Smartphone" },
    { id: "paypal", name: "PayPal", icon: "CreditCard" },
    { id: "bank", name: "Bank Transfer", icon: "Building" },
    { id: "cash", name: "Cash", icon: "Banknote" }
  ];

  const handleSettle = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const settlement = {
        fromUser: balance.amount < 0 ? balance.userId : balance.withUser,
        toUser: balance.amount < 0 ? balance.withUser : balance.userId,
        amount: Math.abs(balance.amount),
        currency: balance.currency,
        method: selectedMethod,
        relatedExpenses: []
      };

      await settlementService.create(settlement);
      await balanceService.settleBalance(balance.userId, balance.withUser);
      
      toast.success("Payment marked as settled!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error("Failed to settle payment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedMethod(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
<div className="fixed inset-0 z-50 flex items-end sm:items-start sm:pt-20 justify-center">
          <motion.div
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-surface border-b border-secondary/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-h1 font-bold text-primary">Settle Payment</h2>
              <motion.button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="X" size={20} className="text-secondary" />
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              <Card>
                <div className="text-center">
                  <p className="text-body text-secondary mb-2">
                    {balance.amount < 0 ? "You are paying" : "You are receiving"}
                  </p>
                  <p className="text-balance font-bold text-primary mb-2">
                    {formatAmount(balance.amount, balance.currency)}
                  </p>
                  <p className="text-body text-secondary">
                    {balance.amount < 0 ? "to" : "from"} {balance.withUser}
                  </p>
                </div>
              </Card>

              <div>
                <h4 className="text-body font-semibold text-primary mb-3">
                  Select Payment Method
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedMethod === method.id
                          ? "border-accent bg-accent/5"
                          : "border-secondary/20 bg-surface"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon
                        name={method.icon}
                        size={24}
                        className={`mx-auto mb-2 ${
                          selectedMethod === method.id ? "text-accent" : "text-secondary"
                        }`}
                      />
                      <p className={`text-caption font-medium ${
                        selectedMethod === method.id ? "text-accent" : "text-secondary"
                      }`}>
                        {method.name}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleSettle}
                  disabled={!selectedMethod || loading}
                  className="flex-1"
                >
                  {loading ? "Processing..." : "Mark as Settled"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettlementModal;