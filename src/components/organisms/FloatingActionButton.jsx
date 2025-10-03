import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FloatingActionButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-16 h-16 bg-accent rounded-full shadow-lg flex items-center justify-center z-40"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <ApperIcon name="Plus" size={28} className="text-surface" />
    </motion.button>
  );
};

export default FloatingActionButton;