import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navItems = [
    { to: "/", icon: "Home", label: "Dashboard" },
    { to: "/groups", icon: "Users", label: "Groups" },
    { to: "/history", icon: "List", label: "History" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-secondary/10 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] min-h-[56px]",
                isActive ? "text-accent bg-accent/5" : "text-secondary"
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
                <span className="text-[12px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;