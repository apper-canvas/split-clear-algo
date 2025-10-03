import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [fontSize, setFontSize] = useState("medium");
  const [contrast, setContrast] = useState("normal");
  const [colorTheme, setColorTheme] = useState("standard");
  const [notifications, setNotifications] = useState({
    expenseAdded: true,
    paymentReceived: true,
    remindersDue: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("splitClearSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || "medium");
      setContrast(settings.contrast || "normal");
      setColorTheme(settings.colorTheme || "standard");
      setNotifications(settings.notifications || notifications);
    }
  }, []);

  useEffect(() => {
    applySettings();
    saveSettings();
  }, [fontSize, contrast, colorTheme, notifications]);

  const applySettings = () => {
    document.documentElement.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
      "font-size-extra-large",
      "high-contrast",
      "theme-protanopia",
      "theme-deuteranopia",
      "theme-tritanopia"
    );

    document.documentElement.classList.add(`font-size-${fontSize}`);
    
    if (contrast === "high") {
      document.documentElement.classList.add("high-contrast");
    }
    
    if (colorTheme !== "standard") {
      document.documentElement.classList.add(`theme-${colorTheme}`);
    }
  };

  const saveSettings = () => {
    const settings = {
      fontSize,
      contrast,
      colorTheme,
      notifications
    };
    localStorage.setItem("splitClearSettings", JSON.stringify(settings));
  };

  const fontSizes = [
    { value: "small", label: "Small", size: "14px" },
    { value: "medium", label: "Medium", size: "16px" },
    { value: "large", label: "Large", size: "20px" },
    { value: "extra-large", label: "Extra Large", size: "24px" }
  ];

  const colorThemes = [
    { value: "standard", label: "Standard", desc: "Default colors" },
    { value: "protanopia", label: "Protanopia", desc: "Red-blind friendly" },
    { value: "deuteranopia", label: "Deuteranopia", desc: "Green-blind friendly" },
    { value: "tritanopia", label: "Tritanopia", desc: "Blue-blind friendly" }
  ];

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Notification preference updated");
  };

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 px-6 py-8 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-h1 font-bold text-primary mb-2">Settings</h1>
          <p className="text-body text-secondary">Customize your experience</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-6">
        <div>
          <h2 className="text-h2 font-semibold text-primary mb-4">Accessibility</h2>
          
          <Card className="mb-4">
            <h3 className="text-body font-semibold text-primary mb-3">Font Size</h3>
            <div className="grid grid-cols-2 gap-3">
              {fontSizes.map((size) => (
                <motion.button
                  key={size.value}
                  onClick={() => {
                    setFontSize(size.value);
                    toast.success("Font size updated");
                  }}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    fontSize === size.value
                      ? "border-accent bg-accent/5"
                      : "border-secondary/20 bg-surface"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className={`font-semibold mb-1 ${
                    fontSize === size.value ? "text-accent" : "text-primary"
                  }`}>
                    {size.label}
                  </p>
                  <p className="text-caption text-secondary">{size.size}</p>
                </motion.button>
              ))}
            </div>
          </Card>

          <Card className="mb-4">
            <h3 className="text-body font-semibold text-primary mb-3">Contrast</h3>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => {
                  setContrast("normal");
                  toast.success("Contrast updated");
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  contrast === "normal"
                    ? "border-accent bg-accent/5"
                    : "border-secondary/20 bg-surface"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className={`font-semibold ${
                  contrast === "normal" ? "text-accent" : "text-primary"
                }`}>
                  Normal
                </p>
              </motion.button>
              <motion.button
                onClick={() => {
                  setContrast("high");
                  toast.success("High contrast enabled");
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  contrast === "high"
                    ? "border-accent bg-accent/5"
                    : "border-secondary/20 bg-surface"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className={`font-semibold ${
                  contrast === "high" ? "text-accent" : "text-primary"
                }`}>
                  High
                </p>
              </motion.button>
            </div>
          </Card>

          <Card>
            <h3 className="text-body font-semibold text-primary mb-3">Color Theme</h3>
            <div className="space-y-2">
              {colorThemes.map((theme) => (
                <motion.button
                  key={theme.value}
                  onClick={() => {
                    setColorTheme(theme.value);
                    toast.success(`${theme.label} theme activated`);
                  }}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    colorTheme === theme.value
                      ? "border-accent bg-accent/5"
                      : "border-secondary/20 bg-surface"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <p className={`font-semibold mb-1 ${
                    colorTheme === theme.value ? "text-accent" : "text-primary"
                  }`}>
                    {theme.label}
                  </p>
                  <p className="text-caption text-secondary">{theme.desc}</p>
                </motion.button>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-h2 font-semibold text-primary mb-4">Notifications</h2>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body font-medium text-primary">Expense Added</p>
                  <p className="text-caption text-secondary">When someone adds an expense</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationToggle("expenseAdded")}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.expenseAdded ? "bg-accent" : "bg-secondary/30"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-surface rounded-full shadow-md"
                    animate={{ x: notifications.expenseAdded ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body font-medium text-primary">Payment Received</p>
                  <p className="text-caption text-secondary">When you receive a payment</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationToggle("paymentReceived")}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.paymentReceived ? "bg-accent" : "bg-secondary/30"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-surface rounded-full shadow-md"
                    animate={{ x: notifications.paymentReceived ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body font-medium text-primary">Payment Reminders</p>
                  <p className="text-caption text-secondary">Gentle reminders for pending payments</p>
                </div>
                <motion.button
                  onClick={() => handleNotificationToggle("remindersDue")}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications.remindersDue ? "bg-accent" : "bg-secondary/30"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-surface rounded-full shadow-md"
                    animate={{ x: notifications.remindersDue ? 26 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-h2 font-semibold text-primary mb-4">About</h2>
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <ApperIcon name="DollarSign" size={32} className="text-accent" />
              </div>
              <div>
                <h3 className="text-h2 font-bold text-primary">Split Clear</h3>
                <p className="text-caption text-secondary">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-body text-secondary">
              Effortless expense sharing for everyone, aged 14-60. Track group purchases, 
              itemize receipts, and settle up with ease.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;