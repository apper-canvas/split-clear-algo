import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SyncIndicator = ({ status = "synced", pendingCount = 0, onSync }) => {
  const variants = {
    syncing: {
      bg: "bg-info",
      text: "text-surface",
      icon: "RefreshCw"
    },
    synced: {
      bg: "bg-success",
      text: "text-surface",
      icon: "CheckCircle"
    },
    offline: {
      bg: "bg-warning",
      text: "text-surface",
      icon: "WifiOff"
    },
    error: {
      bg: "bg-error",
      text: "text-surface",
      icon: "AlertCircle"
    }
  };

  const variant = variants[status];

  if (status === "synced" && pendingCount === 0) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "flex items-center justify-between px-4 py-2 text-caption font-medium",
        variant.bg,
        variant.text
      )}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={status === "syncing" ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ApperIcon name={variant.icon} size={16} />
        </motion.div>
        <span>
          {status === "syncing" && "Syncing..."}
          {status === "synced" && "All synced"}
          {status === "offline" && `${pendingCount} items pending`}
          {status === "error" && "Sync failed"}
        </span>
      </div>
      {(status === "offline" || status === "error") && (
        <motion.button
          onClick={onSync}
          className="underline"
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      )}
    </motion.div>
  );
};

export default SyncIndicator;