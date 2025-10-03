import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import balanceService from '@/services/api/balanceService';
import groupService from '@/services/api/groupService';

function GroupBalanceSummary() {
  const [balances, setBalances] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("groupName"); // groupName, balance
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [balancesData, groupsData] = await Promise.all([
        balanceService.getAll(),
        groupService.getAll()
      ]);
      
      // Aggregate balances by group
      const groupBalances = aggregateBalancesByGroup(balancesData, groupsData);
      setBalances(groupBalances);
      setGroups(groupsData);
      toast.success("Balance summary loaded successfully");
    } catch (err) {
      const errorMessage = err.message || "Failed to load balance summary";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function aggregateBalancesByGroup(balancesData, groupsData) {
    const groupMap = new Map();

    groupsData.forEach(group => {
      groupMap.set(group.name, {
        groupId: group.Id,
        groupName: group.name,
        members: group.members,
        currency: group.currency,
        totalBalance: 0,
        positiveBalances: 0,
        negativeBalances: 0
      });
    });

    balancesData.forEach(balance => {
      // Find which group this balance belongs to
      const group = groupsData.find(g => 
        g.members.includes(balance.withUser)
      );

      if (group && groupMap.has(group.name)) {
        const groupData = groupMap.get(group.name);
        groupData.totalBalance += balance.amount;
        
        if (balance.amount > 0) {
          groupData.positiveBalances += balance.amount;
        } else {
          groupData.negativeBalances += Math.abs(balance.amount);
        }
      }
    });

    return Array.from(groupMap.values()).filter(g => g.totalBalance !== 0);
  }

  const formatAmount = (amount, currency = "INR") => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (balance) => {
    if (balance > 0) return "text-success";
    if (balance < 0) return "text-error";
    return "text-secondary";
  };

  const getStatusText = (balance) => {
    if (balance > 0) return "You are owed";
    if (balance < 0) return "You owe";
    return "Settled";
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedBalances = balances
    .filter(b => 
      b.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "groupName") {
        comparison = a.groupName.localeCompare(b.groupName);
      } else if (sortBy === "balance") {
        comparison = a.totalBalance - b.totalBalance;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  if (loading) {
    return <Loading message="Loading group balance summary..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 px-6 py-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent/10 rounded-xl">
              <ApperIcon name="Wallet" size={24} className="text-accent" />
            </div>
            <h1 className="text-h1 font-display font-semibold text-primary">
              Group Balance Summary
            </h1>
          </div>
          <p className="text-caption text-secondary mt-2">
            Total financial balance for each user group
          </p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon="Search"
          />
        </motion.div>
      </div>

      {/* Balance Summary Cards */}
      <div className="px-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="ArrowUpCircle" size={20} className="text-success" />
              <p className="text-caption text-secondary">Total Owed to You</p>
            </div>
            <p className="text-h1 font-semibold text-success">
              {formatAmount(
                balances.reduce((sum, b) => sum + (b.totalBalance > 0 ? b.totalBalance : 0), 0)
              )}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="ArrowDownCircle" size={20} className="text-error" />
              <p className="text-caption text-secondary">Total You Owe</p>
            </div>
            <p className="text-h1 font-semibold text-error">
              {formatAmount(
                Math.abs(balances.reduce((sum, b) => sum + (b.totalBalance < 0 ? b.totalBalance : 0), 0))
              )}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Balance Table */}
      {filteredAndSortedBalances.length === 0 ? (
        <Empty 
          message={searchTerm ? "No groups match your search" : "No outstanding balances"} 
          icon="Wallet"
        />
      ) : (
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={() => handleSort("groupName")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-caption font-semibold text-secondary">Group Name</span>
                          {sortBy === "groupName" && (
                            <ApperIcon 
                              name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                              size={14} 
                              className="text-accent"
                            />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-caption font-semibold text-secondary">Members</span>
                      </th>
                      <th 
                        className="px-6 py-4 text-right cursor-pointer hover:bg-accent/5 transition-colors"
                        onClick={() => handleSort("balance")}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-caption font-semibold text-secondary">Balance</span>
                          {sortBy === "balance" && (
                            <ApperIcon 
                              name={sortOrder === "asc" ? "ArrowUp" : "ArrowDown"} 
                              size={14} 
                              className="text-accent"
                            />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right">
                        <span className="text-caption font-semibold text-secondary">Status</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-background">
                    {filteredAndSortedBalances.map((balance, index) => (
                      <motion.tr
                        key={balance.groupId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                        className="hover:bg-accent/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                              <ApperIcon name="Users" size={18} className="text-accent" />
                            </div>
                            <span className="text-body font-medium text-primary">
                              {balance.groupName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-body text-secondary">
                            {balance.members.length} members
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-body font-semibold ${getStatusColor(balance.totalBalance)}`}>
                            {formatAmount(Math.abs(balance.totalBalance), balance.currency)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-caption ${getStatusColor(balance.totalBalance)}`}>
                            {getStatusText(balance.totalBalance)}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-background">
                {filteredAndSortedBalances.map((balance, index) => (
                  <motion.div
                    key={balance.groupId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="Users" size={18} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-body font-medium text-primary">
                            {balance.groupName}
                          </p>
                          <p className="text-caption text-secondary">
                            {balance.members.length} members
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-caption ${getStatusColor(balance.totalBalance)}`}>
                        {getStatusText(balance.totalBalance)}
                      </span>
                      <span className={`text-body font-semibold ${getStatusColor(balance.totalBalance)}`}>
                        {formatAmount(Math.abs(balance.totalBalance), balance.currency)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Summary Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6"
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingUp" size={20} className="text-accent" />
                  <span className="text-body font-medium text-primary">Net Balance</span>
                </div>
                <span className={`text-h2 font-semibold ${getStatusColor(
                  balances.reduce((sum, b) => sum + b.totalBalance, 0)
                )}`}>
                  {formatAmount(balances.reduce((sum, b) => sum + b.totalBalance, 0))}
                </span>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default GroupBalanceSummary;