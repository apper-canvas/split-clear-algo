import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-error" />
      </div>
      <h3 className="text-h2 font-semibold text-primary mb-2">Oops!</h3>
      <p className="text-body text-secondary mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 bg-accent text-surface rounded-xl font-medium transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;