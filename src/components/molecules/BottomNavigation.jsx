import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: "Home", label: "Home" },
    { path: "/groups", icon: "Users", label: "Groups" },
    { path: "/group-balances", icon: "Wallet", label: "Balances" },
    { path: "/history", icon: "Clock", label: "History" },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-surface rounded-full p-3 shadow-card min-w-[44px] min-h-[44px] flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name={isOpen ? "X" : "Menu"} size={24} className="text-primary" />
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-secondary/10 z-50 shadow-xl"
          >
            <div className="flex flex-col h-full pt-20 px-4">
{navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl transition-all min-h-[56px] mb-2",
                      isActive ? "text-accent bg-accent/10" : "text-secondary hover:bg-secondary/5"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        animate={{ scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ApperIcon name={item.icon} size={24} />
                      </motion.div>
                      <span className="text-base font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
export default BottomNavigation;