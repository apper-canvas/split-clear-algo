import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import SyncIndicator from "@/components/molecules/SyncIndicator";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import History from "@/components/pages/History";
import Insights from "@/components/pages/Insights";
import Groups from "@/components/pages/Groups";
import Dashboard from "@/components/pages/Dashboard";
import GroupDetail from "@/components/pages/GroupDetail";
import Settings from "@/components/pages/Settings";
import GroupBalanceSummary from "@/components/pages/GroupBalanceSummary";
import AddExpenseModal from "@/components/organisms/AddExpenseModal";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import reminderService from "@/services/api/reminderService";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [syncStatus, setSyncStatus] = useState("synced");

  useEffect(() => {
    const checkReminders = async () => {
      await reminderService.checkAndNotifySettlements();
    };
    
    checkReminders();
    const intervalId = setInterval(checkReminders, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleExpenseAdded = () => {
    setIsAddExpenseOpen(false);
    setSelectedGroupId(null);
    setSyncStatus("syncing");
    
    window.dispatchEvent(new CustomEvent('expenseAdded', { 
      detail: { timestamp: Date.now() } 
    }));
    
    toast.success('Expense added successfully!');
    
    setTimeout(() => {
      setSyncStatus("synced");
    }, 1000);
  };

return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <SyncIndicator status={syncStatus} />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/group-balances" element={<GroupBalanceSummary />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      <BottomNavigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <FloatingActionButton 
        onClick={(groupId) => {
          setSelectedGroupId(groupId || null);
          setIsAddExpenseOpen(true);
        }} 
      />
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setSelectedGroupId(null);
        }}
        onSuccess={handleExpenseAdded}
        groupId={selectedGroupId}
      />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;