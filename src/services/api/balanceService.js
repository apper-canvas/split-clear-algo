import balancesData from "../mockData/balances.json";

let balances = [...balancesData];

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const balanceService = {
  getAll: async () => {
    await delay();
    return [...balances];
  },

  getSummary: async () => {
    await delay();
    let youOwe = 0;
    let owedToYou = 0;
    
    balances.forEach(balance => {
      if (balance.userId === "You") {
        youOwe += balance.amount;
      } else if (balance.withUser === "You") {
        owedToYou += balance.amount;
      }
    });
    
    const netBalance = owedToYou - youOwe;
    
    return {
      youOwe,
      owedToYou,
      netBalance
    };
  },

  addBalance: async (userId, withUser, amount) => {
    await delay();
    const existingBalance = balances.find(
      b => b.userId === userId && b.withUser === withUser
    );
    
    if (existingBalance) {
      existingBalance.amount += amount;
      existingBalance.lastUpdated = new Date().toISOString();
      return { ...existingBalance };
    } else {
      const newBalance = {
        id: balances.length + 1,
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