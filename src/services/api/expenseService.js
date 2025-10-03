import expensesData from "../mockData/expenses.json";

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
  }
};

export default expenseService;