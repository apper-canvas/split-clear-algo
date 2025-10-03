import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ContactChip from "@/components/molecules/ContactChip";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import groupService from "@/services/api/groupService";
import expenseService from "@/services/api/expenseService";
const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const [isListening, setIsListening] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
const [currency, setCurrency] = useState("INR");
  const [category, setCategory] = useState("Food");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactInput, setContactInput] = useState("");
  useEffect(() => {
    if (isOpen) {
      loadGroups();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    try {
      const data = await groupService.getAll();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups:", error);
    }
  };

  const parseNaturalLanguage = (text) => {
    const amountMatch = text.match(/[₹$€£]\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    const withMatch = text.match(/with\s+(.+?)(?:\s+and\s+)?/i);
    
    if (amountMatch) {
      const extractedAmount = amountMatch[1].replace(/,/g, "");
      setAmount(extractedAmount);
      
      if (text.includes("₹")) setCurrency("INR");
      else if (text.includes("$")) setCurrency("USD");
      else if (text.includes("€")) setCurrency("EUR");
      else if (text.includes("£")) setCurrency("GBP");
    }
    
    if (withMatch) {
      const names = withMatch[1]
        .split(/\s+and\s+|\s*,\s*/)
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      setSelectedContacts(prev => {
        const existing = prev.map(c => c.toLowerCase());
        const newContacts = names.filter(name => !existing.includes(name.toLowerCase()));
        return [...prev, ...newContacts];
      });
    }
    
    const descMatch = text.replace(/[₹$€£]\s*\d+(?:,\d{3})*(?:\.\d{2})?/, "").replace(/with\s+.+$/i, "").trim();
    if (descMatch) {
      setDescription(descMatch);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      const sampleInput = "Lunch ₹850 with Neha and Samir";
parseNaturalLanguage(sampleInput);
      setDescription("Lunch");
      setAmount("850");
      setSelectedContacts(["Neha", "Samir"]);
      setIsListening(false);
      toast.info("Voice input processed!");
    }, 1500);
  };

  const handleTextInput = (e) => {
    const text = e.target.value;
    setDescription(text);
    parseNaturalLanguage(text);
  };

  const handleAddContact = () => {
    if (contactInput.trim() && !selectedContacts.includes(contactInput.trim())) {
      setSelectedContacts([...selectedContacts, contactInput.trim()]);
      setContactInput("");
    }
  };

  const handleRemoveContact = (contact) => {
    setSelectedContacts(selectedContacts.filter(c => c !== contact));
  };

  const handleQuickGroup = (group) => {
    const contacts = group.members.filter(m => m !== "You");
    setSelectedContacts(contacts);
    setCurrency(group.currency);
  };

const handleSubmit = async () => {
    if (!description || !amount || !category || selectedContacts.length === 0) {
      toast.error("Please fill all required fields including category");
      return;
    }

    setLoading(true);
    try {
      const splitAmount = parseFloat(amount) / (selectedContacts.length + 1);
      const splits = { "You": splitAmount };
      selectedContacts.forEach(contact => {
        splits[contact] = splitAmount;
      });

      const expense = {
        description,
        totalAmount: parseFloat(amount),
        currency,
        paidBy: "You",
        groupId: 1,
        items: [{
          name: description,
          price: parseFloat(amount),
          quantity: 1,
          assignedTo: ["You", ...selectedContacts]
        }],
        splits
      };

      await expenseService.create(expense);
      toast.success("Expense added successfully!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error("Failed to add expense");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
setDescription("");
    setAmount("");
    setCurrency("INR");
    setCategory("Food");
    setSelectedContacts([]);
    setContactInput("");
    onClose();
  };

  const categories = [
    { value: "Food", icon: "ShoppingCart" },
    { value: "Transport", icon: "Car" },
    { value: "Entertainment", icon: "Film" },
    { value: "Shopping", icon: "ShoppingBag" },
    { value: "Bills", icon: "Receipt" },
    { value: "Travel", icon: "Plane" },
    { value: "Health", icon: "Heart" },
    { value: "Other", icon: "Tag" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />
        <motion.div
          className="relative w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="sticky top-0 bg-surface border-b border-secondary/10 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-h1 font-bold text-primary">Add Expense</h2>
            <motion.button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="X" size={20} className="text-secondary" />
            </motion.button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder='Try "Lunch ₹850 with Neha and Samir"'
                  value={description}
                  onChange={handleTextInput}
                  className="flex-1"
                />
                <motion.button
                  onClick={handleVoiceInput}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isListening ? "bg-accent" : "bg-accent/10"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon
                    name={isListening ? "MicOff" : "Mic"}
                    size={24}
                    className={isListening ? "text-surface" : "text-accent"}
                  />
                </motion.button>
              </div>
              <p className="text-caption text-secondary">
                Speak or type naturally. We'll parse the details automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div>
                <label className="block text-body font-medium text-primary mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border-2 border-secondary/30 rounded-xl text-body text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all min-h-[48px]"
                >
                  <option value="INR">₹ INR</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
</div>

            {/* Category Selector */}
            <div>
              <label className="block text-caption text-secondary mb-2 font-medium">
                Category *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="w-full px-4 py-3 bg-surface border border-secondary/20 rounded-xl text-left flex items-center justify-between hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ApperIcon 
                      name={categories.find(c => c.value === category)?.icon || "Tag"} 
                      size={18} 
                      className="text-accent" 
                    />
                    <span className="text-body">{category}</span>
                  </div>
                  <ApperIcon 
                    name={showCategoryDropdown ? "ChevronUp" : "ChevronDown"} 
                    size={18} 
                  />
                </button>
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-2 bg-surface border border-secondary/20 rounded-xl shadow-lg overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => {
                            setCategory(cat.value);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/5 transition-colors ${
                            category === cat.value ? "bg-accent/10" : ""
                          }`}
                        >
                          <ApperIcon name={cat.icon} size={18} className="text-accent" />
                          <span className="text-body">{cat.value}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
)}
                </AnimatePresence>
              </div>
            </div>

<div>
              <label className="block text-body font-medium text-primary mb-2">
                Split with
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add person"
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddContact()}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleAddContact} size="small">
                  <ApperIcon name="Plus" size={16} />
                </Button>
              </div>
              {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedContacts.map((contact) => (
                    <ContactChip
                      key={contact}
                      name={contact}
                      onRemove={() => handleRemoveContact(contact)}
                    />
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <p className="text-caption text-secondary font-medium">Quick groups</p>
                <div className="flex flex-wrap gap-2">
                  {groups.slice(0, 3).map((group) => (
                    <motion.button
                      key={group.Id}
                      onClick={() => handleQuickGroup(group)}
                      className="px-3 py-2 bg-accent/5 hover:bg-accent/10 rounded-lg text-caption text-accent font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {group.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {amount && selectedContacts.length > 0 && (
              <motion.div
                className="p-4 bg-accent/5 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-caption text-secondary mb-2">Split breakdown</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-body">
                    <span className="text-primary">You</span>
                    <span className="font-semibold text-accent">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: currency,
                        minimumFractionDigits: 2
                      }).format(parseFloat(amount) / (selectedContacts.length + 1))}
                    </span>
                  </div>
                  {selectedContacts.map((contact) => (
                    <div key={contact} className="flex justify-between text-body">
                      <span className="text-primary">{contact}</span>
                      <span className="font-semibold text-accent">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: currency,
                          minimumFractionDigits: 2
                        }).format(parseFloat(amount) / (selectedContacts.length + 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddExpenseModal;