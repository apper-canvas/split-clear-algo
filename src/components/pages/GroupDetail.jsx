import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ExpenseItem from '@/components/molecules/ExpenseItem';
import ContactChip from '@/components/molecules/ContactChip';
import groupService from '@/services/api/groupService';
import expenseService from '@/services/api/expenseService';
import balanceService from '@/services/api/balanceService';

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  useEffect(() => {
loadGroupData();
  }, [id]);

  async function loadGroupData() {
    try {
      setLoading(true);
      setError('');
      
      const [groupData, allExpenses, allBalances, allGroupsData] = await Promise.all([
        groupService.getById(parseInt(id)),
        expenseService.getAll(),
        balanceService.getAll(),
        groupService.getAll()
      ]);

      if (!groupData) {
        setError('Group not found');
        toast.error('Group not found');
        return;
      }

      // Filter expenses for this group
      const groupExpenses = allExpenses.filter(expense => 
        expense.group === groupData.name
      );

      // Filter balances for this group members
      const groupBalances = allBalances.filter(balance =>
        groupData.members.includes(balance.withUser)
      );

      setGroup(groupData);
      setExpenses(groupExpenses);
      setBalances(groupBalances);
      setAllGroups(allGroupsData);
      toast.success('Group details loaded successfully');
    } catch (err) {
      const errorMessage = err.message || 'Failed to load group details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function getCurrentGroupIndex() {
    return allGroups.findIndex(g => g.Id === parseInt(id));
  }

  function handlePreviousGroup() {
    const currentIndex = getCurrentGroupIndex();
    if (currentIndex > 0) {
      const previousGroup = allGroups[currentIndex - 1];
      navigate(`/groups/${previousGroup.Id}`);
    }
  }

  function handleNextGroup() {
    const currentIndex = getCurrentGroupIndex();
    if (currentIndex < allGroups.length - 1) {
      const nextGroup = allGroups[currentIndex + 1];
      navigate(`/groups/${nextGroup.Id}`);
    }
  }

  function formatAmount(amount, currency = 'INR') {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
  }

  function getTotalExpenses() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  function getYourBalance() {
    return balances.reduce((sum, balance) => sum + balance.amount, 0);
  }

  function getMemberBalance(memberName) {
    const memberBalances = balances.filter(b => b.withUser === memberName);
    return memberBalances.reduce((sum, balance) => sum + balance.amount, 0);
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGroupData} />;
  if (!group) return <Error message="Group not found" onRetry={() => navigate('/groups')} />;

  return (
    <div className="min-h-screen bg-background pb-24">
{/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-surface border-b border-background sticky top-0 z-10"
      >
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/groups')}
              className="p-2 -ml-2 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ApperIcon name="ArrowLeft" size={24} className="text-primary" />
            </button>
            <div className="flex-1">
              <h1 className="text-h1 font-display font-semibold text-primary">
                {group.name}
              </h1>
              <p className="text-caption text-secondary">
                {group.members.length} members • {expenses.length} expenses
              </p>
            </div>
            {allGroups.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousGroup}
                  disabled={getCurrentGroupIndex() === 0}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous group"
                >
                  <ApperIcon name="ChevronLeft" size={20} className="text-primary" />
                </button>
                <button
                  onClick={handleNextGroup}
                  disabled={getCurrentGroupIndex() === allGroups.length - 1}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next group"
                >
                  <ApperIcon name="ChevronRight" size={20} className="text-primary" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-caption text-secondary mb-1">Total Spent</p>
              <p className="text-h2 font-semibold text-primary">
                {formatAmount(getTotalExpenses(), group.currency)}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-caption text-secondary mb-1">Your Balance</p>
              <p className={`text-h2 font-semibold ${getYourBalance() >= 0 ? 'text-success' : 'text-error'}`}>
                {formatAmount(getYourBalance(), group.currency)}
              </p>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Members Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="px-6 py-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <ApperIcon name="Users" size={20} className="text-accent" />
          <h2 className="text-h2 font-display font-semibold text-primary">
            Members
          </h2>
        </div>
        <Card className="p-4">
          <div className="space-y-3">
            {group.members.map((member, index) => {
              const memberBalance = getMemberBalance(member);
              return (
                <motion.div
                  key={member}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <ContactChip name={member} />
                  <span className={`text-body font-semibold ${memberBalance >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatAmount(memberBalance, group.currency)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Expenses Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="px-6 py-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ApperIcon name="Receipt" size={20} className="text-accent" />
            <h2 className="text-h2 font-display font-semibold text-primary">
              Expenses
            </h2>
          </div>
          <span className="text-caption text-secondary">
            {expenses.length} total
          </span>
        </div>

        {expenses.length === 0 ? (
          <Empty message="No expenses in this group yet" icon="Receipt" />
        ) : (
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
              >
                <ExpenseItem
                  expense={expense}
                  onClick={() => setSelectedExpense(expense)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="px-6 py-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => toast.info('Settle up feature coming soon')}
            className="w-full"
          >
            <ApperIcon name="DollarSign" size={18} className="mr-2" />
            Settle Up
          </Button>
          <Button
            onClick={() => toast.info('Add expense feature available via FAB')}
            className="w-full"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Expense
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default GroupDetail;