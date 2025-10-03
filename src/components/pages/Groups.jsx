import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GroupCard from "@/components/molecules/GroupCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import groupService from "@/services/api/groupService";
import balanceService from "@/services/api/balanceService";

const Groups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [groupsData, balancesData] = await Promise.all([
        groupService.getAll(),
        balanceService.getAll()
      ]);
      setGroups(groupsData);
      setBalances(balancesData);
    } catch (err) {
      setError("Failed to load groups. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGroupBalance = (group) => {
    const groupMembers = group.members.filter(m => m !== "You");
    const groupBalances = balances.filter(b => 
      groupMembers.includes(b.withUser)
    );
    return groupBalances.reduce((sum, b) => sum + b.amount, 0);
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
          <h1 className="text-h1 font-bold text-primary mb-2">Groups</h1>
          <p className="text-body text-secondary">Manage your expense groups</p>
        </motion.div>
      </div>

      <div className="px-6">
        {groups.length === 0 ? (
          <Empty
            icon="Users"
            title="No groups yet"
            message="Groups help you organize expenses with recurring members"
          />
        ) : (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {groups.map((group, index) => (
              <motion.div
                key={group.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <GroupCard
                  group={group}
                  balance={getGroupBalance(group)}
onClick={() => navigate(`/groups/${group.Id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Groups;