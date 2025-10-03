import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Dashboard from "@/components/pages/Dashboard";
import Groups from "@/components/pages/Groups";
import Insights from "@/components/pages/Insights";
import History from "@/components/pages/History";
import Settings from "@/components/pages/Settings";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import FloatingActionButton from "@/components/organisms/FloatingActionButton";
import AddExpenseModal from "@/components/organisms/AddExpenseModal";
import SyncIndicator from "@/components/molecules/SyncIndicator";

function App() {
const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState("synced");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleExpenseAdded = () => {
    window.location.reload();
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <SyncIndicator status={syncStatus} />
        
<Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
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