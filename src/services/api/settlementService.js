import settlementsData from "../mockData/settlements.json";

let settlements = [...settlementsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const settlementService = {
  getAll: async () => {
    await delay();
    return [...settlements];
  },

  getById: async (id) => {
    await delay();
    const settlement = settlements.find(s => s.Id === parseInt(id));
    return settlement ? { ...settlement } : null;
  },

  create: async (settlement) => {
    await delay();
    const maxId = settlements.length > 0 ? Math.max(...settlements.map(s => s.Id)) : 0;
    const newSettlement = {
      ...settlement,
      Id: maxId + 1,
      date: new Date().toISOString()
    };
    settlements.push(newSettlement);
    return { ...newSettlement };
  },

  getByUser: async (userId) => {
    await delay();
    return settlements.filter(
      s => s.fromUser === userId || s.toUser === userId
    );
  }
};

export default settlementService;