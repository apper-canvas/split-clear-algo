import expensesData from "@/services/mockData/expenses.json";
let expenses = [...expensesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const expenseService = {
  getAll: async () => {
    await delay();
    return [...expenses];
  },

  getById: async (id) => {
    await delay();
    const expense = expenses.find(e => e.Id === parseInt(id));
    return expense ? { ...expense } : null;
  },

create: async (expense) => {
    await delay();
    const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) : 0;
    const newExpense = {
      ...expense,
      Id: maxId + 1,
      category: expense.category || "Other",
      date: new Date().toISOString(),
      settled: false,
      createdOffline: false,
      synced: true
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  update: async (id, data) => {
    await delay();
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...data };
      return { ...expenses[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses.splice(index, 1);
      return true;
    }
    return false;
  },

  getRecent: async (limit = 5) => {
    await delay();
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  getByGroup: async (groupId) => {
    await delay();
    return expenses.filter(e => e.groupId === parseInt(groupId));
  },

settleExpense: async (id) => {
    await delay();
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses[index].settled = true;
      return { ...expenses[index] };
    }
    return null;
  },

  getByCategory: async (category) => {
    await delay();
    return expenses.filter(e => e.category === category).map(e => ({ ...e }));
  },
  getCategoryTotals: async () => {
    await delay();
    const totals = {};
    expenses.forEach(expense => {
      const category = expense.category || "Other";
      totals[category] = (totals[category] || 0) + expense.totalAmount;
    });
    return totals;
  },

  getCollaboratorFrequency: async () => {
    await delay();
    const frequency = {};
    expenses.forEach(expense => {
      if (expense.splits) {
        Object.keys(expense.splits).forEach(person => {
          if (person !== "You") {
            frequency[person] = (frequency[person] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  },

  getDailySpending: async (days = 7) => {
    await delay();
    const now = new Date();
    const dailyTotals = {};
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyTotals[dateStr] = 0;
    }

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      if (dailyTotals.hasOwnProperty(expenseDate)) {
        dailyTotals[expenseDate] += expense.totalAmount;
      }
    });

    return dailyTotals;
  }
};

export default expenseService;