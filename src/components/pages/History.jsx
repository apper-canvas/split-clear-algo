import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ExpenseItem from "@/components/molecules/ExpenseItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import expenseService from "@/services/api/expenseService";
import ExpenseDetailSheet from "@/components/organisms/ExpenseDetailSheet";

const History = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, searchQuery, filterStatus]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await expenseService.getAll();
      setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError("Failed to load expenses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.paidBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === "settled") {
      filtered = filtered.filter(e => e.settled);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter(e => !e.settled);
    }

    setFilteredExpenses(filtered);
  };

  const filterButtons = [
    { id: "all", label: "All", icon: "List" },
    { id: "pending", label: "Pending", icon: "Clock" },
    { id: "settled", label: "Settled", icon: "CheckCircle" }
  ];

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 px-6 py-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-h1 font-bold text-primary mb-2">History</h1>
          <p className="text-body text-secondary">All your expenses in one place</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <ApperIcon
              name="Search"
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
            />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterButtons.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filterStatus === filter.id
                    ? "bg-accent text-surface"
                    : "bg-surface text-secondary border border-secondary/20"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name={filter.icon} size={16} />
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {filteredExpenses.length === 0 ? (
          <Empty
            icon="Receipt"
            title={searchQuery ? "No results found" : "No expenses yet"}
            message={
              searchQuery
                ? "Try adjusting your search or filters"
                : 'Tap the "+" button to add your first expense'
            }
          />
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
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

      <ExpenseDetailSheet
        expense={selectedExpense}
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        onUpdate={loadData}
      />
    </div>
  );
};

export default History;