import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GroupBalanceSummary from "@/components/pages/GroupBalanceSummary";
import React, { useState } from "react";
import SyncIndicator from "@/components/molecules/SyncIndicator";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import History from "@/components/pages/History";
import Insights from "@/components/pages/Insights";
import Groups from "@/components/pages/Groups";
import Dashboard from "@/components/pages/Dashboard";
import Settings from "@/components/pages/Settings";
import AddExpenseModal from "@/components/organisms/AddExpenseModal";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";

function App() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleExpenseAdded = () => {
    setSyncStatus("syncing");
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
          <Route path="/group-balances" element={<GroupBalanceSummary />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <BottomNavigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        <FloatingActionButton onClick={() => setIsAddExpenseOpen(true)} />
        
        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          onSuccess={handleExpenseAdded}
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