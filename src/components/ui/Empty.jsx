import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox",
  title = "Nothing here yet",
  message = "Get started by adding your first item",
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={40} className="text-accent" />
      </div>
      <h3 className="text-h2 font-semibold text-primary mb-2">{title}</h3>
      <p className="text-body text-secondary mb-6 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          className="px-6 py-3 bg-accent text-surface rounded-xl font-medium transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;