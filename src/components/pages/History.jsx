import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ExpenseItem from "@/components/molecules/ExpenseItem";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ExpenseDetailSheet from "@/components/organisms/ExpenseDetailSheet";
import Input from "@/components/atoms/Input";
import expenseService from "@/services/api/expenseService";

const History = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
applyFilters();
  }, [expenses, searchQuery, filterStatus, filterCategory]);

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

    if (filterCategory !== "all") {
      filtered = filtered.filter(e => e.category === filterCategory);
    }

    setFilteredExpenses(filtered);
  };

const filterButtons = [
    { id: "all", label: "All", icon: "List" },
    { id: "pending", label: "Pending", icon: "Clock" },
    { id: "settled", label: "Settled", icon: "CheckCircle" }
  ];

  const categories = [
    "Food", "Transport", "Entertainment", "Shopping", "Bills", "Travel", "Health", "Other"
  ];

  const getCategoryCount = (category) => {
    return expenses.filter(e => e.category === category).length;
  };

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

        {/* Category Filter */}
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filterCategory !== "all"
                  ? "bg-accent text-surface"
                  : "bg-surface text-secondary border border-secondary/20 hover:border-accent/50"
              }`}
            >
              <ApperIcon name="Tag" size={16} />
              <span>Category</span>
              {filterCategory !== "all" && (
                <span className="ml-1">: {filterCategory}</span>
              )}
              <ApperIcon 
                name={showCategoryDropdown ? "ChevronUp" : "ChevronDown"} 
                size={16} 
              />
            </button>

            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 mt-2 bg-surface border border-secondary/20 rounded-xl shadow-lg overflow-hidden min-w-[200px]"
                >
                  <button
                    onClick={() => {
                      setFilterCategory("all");
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-accent/5 transition-colors flex items-center justify-between ${
                      filterCategory === "all" ? "bg-accent/10 text-accent font-medium" : ""
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="text-caption text-secondary">{expenses.length}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setFilterCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-accent/5 transition-colors flex items-center justify-between ${
                        filterCategory === cat ? "bg-accent/10 text-accent font-medium" : ""
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-caption text-secondary">{getCategoryCount(cat)}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

{/* Expenses List */}
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