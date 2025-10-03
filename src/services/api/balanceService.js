import balancesData from "../mockData/balances.json";

let balances = [...balancesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const balanceService = {
  getAll: async () => {
    await delay();
    return [...balances];
  },

  getById: async (id) => {
    await delay();
    const balance = balances.find(b => b.Id === parseInt(id));
    return balance ? { ...balance } : null;
  },

  getSummary: async () => {
    await delay();
    const youOwe = balances
      .filter(b => b.amount < 0)
      .reduce((sum, b) => sum + Math.abs(b.amount), 0);
    
    const owedToYou = balances
      .filter(b => b.amount > 0)
      .reduce((sum, b) => sum + b.amount, 0);
    
    const netBalance = owedToYou - youOwe;
    
    return { youOwe, owedToYou, netBalance };
  },

  updateBalance: async (userId, withUser, amount) => {
    await delay();
    const index = balances.findIndex(
      b => b.userId === userId && b.withUser === withUser
    );
    
    if (index !== -1) {
      balances[index].amount += amount;
      balances[index].lastUpdated = new Date().toISOString();
      return { ...balances[index] };
    } else {
      const maxId = balances.length > 0 ? Math.max(...balances.map(b => b.Id)) : 0;
      const newBalance = {
        Id: maxId + 1,
        userId,
        withUser,
        amount,
        currency: "INR",
        lastUpdated: new Date().toISOString()
      };
      balances.push(newBalance);
      return { ...newBalance };
    }
  },

  settleBalance: async (userId, withUser) => {
    await delay();
    const index = balances.findIndex(
      b => b.userId === userId && b.withUser === withUser
    );
    
    if (index !== -1) {
      balances[index].amount = 0;
      balances[index].lastUpdated = new Date().toISOString();
      return { ...balances[index] };
    }
    return null;
  }
};

export default balanceService;