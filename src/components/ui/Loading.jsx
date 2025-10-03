import { motion } from "framer-motion";

const Loading = ({ variant = "default" }) => {
  if (variant === "balance") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="bg-surface rounded-2xl p-6 shadow-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="h-4 w-24 bg-secondary/20 rounded mb-3" />
              <div className="h-12 w-32 bg-secondary/30 rounded" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="bg-surface rounded-xl p-4 shadow-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="h-5 w-40 bg-secondary/30 rounded" />
              <div className="h-5 w-20 bg-secondary/30 rounded" />
            </div>
            <div className="h-4 w-32 bg-secondary/20 rounded mb-2" />
            <div className="h-4 w-24 bg-secondary/20 rounded" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;