import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BalanceCard from "@/components/molecules/BalanceCard";
import ExpenseItem from "@/components/molecules/ExpenseItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import balanceService from "@/services/api/balanceService";
import expenseService from "@/services/api/expenseService";
import ExpenseDetailSheet from "@/components/organisms/ExpenseDetailSheet";
import SettlementModal from "@/components/organisms/SettlementModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ youOwe: 0, owedToYou: 0, netBalance: 0 });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [settlementBalance, setSettlementBalance] = useState(null);

useEffect(() => {
    loadData();
    
    const handleExpenseSettled = () => {
      loadData();
    };
    
    window.addEventListener('expenseSettled', handleExpenseSettled);
    
    return () => {
      window.removeEventListener('expenseSettled', handleExpenseSettled);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [summaryData, expensesData, balancesData] = await Promise.all([
        balanceService.getSummary(),
        expenseService.getRecent(5),
        balanceService.getAll()
      ]);
      setSummary(summaryData);
      setRecentExpenses(expensesData);
      setBalances(balancesData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettleUp = () => {
    const unsettledBalance = balances.find(b => b.amount !== 0);
    if (unsettledBalance) {
      setSettlementBalance(unsettledBalance);
    }
  };

  if (loading) return <Loading variant="balance" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 px-6 py-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-h1 font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-body text-secondary">Your expense summary at a glance</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-6">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <BalanceCard
            label="You Owe"
            amount={summary.youOwe}
            variant="owe"
            onClick={summary.youOwe > 0 ? handleSettleUp : undefined}
          />
          <BalanceCard
            label="Owed to You"
            amount={summary.owedToYou}
            variant="owed"
          />
          <BalanceCard
            label="Net Balance"
            amount={summary.netBalance}
            variant="default"
          />
        </motion.div>

        {summary.youOwe > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button
              variant="success"
              className="w-full"
              onClick={handleSettleUp}
            >
              <ApperIcon name="DollarSign" size={20} />
              Settle Up Now
            </Button>
          </motion.div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h2 font-semibold text-primary">Recent Activity</h2>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate("/history")}
            >
              View All
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
          {recentExpenses.length === 0 ? (
            <Empty
              icon="Receipt"
              title="No expenses yet"
              message='Tap the "+" button to add your first expense'
            />
          ) : (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {recentExpenses.map((expense, index) => (
                <motion.div
                  key={expense.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                >
                  <ExpenseItem
                    expense={expense}
                    onClick={() => setSelectedExpense(expense)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <ExpenseDetailSheet
        expense={selectedExpense}
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        onUpdate={loadData}
      />

      <SettlementModal
        balance={settlementBalance}
        isOpen={!!settlementBalance}
        onClose={() => setSettlementBalance(null)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Dashboard;