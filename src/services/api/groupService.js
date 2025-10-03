import groupsData from "../mockData/groups.json";

let groups = [...groupsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

const groupService = {
  getAll: async () => {
    await delay();
    return [...groups];
  },

  getById: async (id) => {
    await delay();
    const group = groups.find(g => g.Id === parseInt(id));
    return group ? { ...group } : null;
  },

  create: async (group) => {
    await delay();
    const maxId = groups.length > 0 ? Math.max(...groups.map(g => g.Id)) : 0;
    const newGroup = {
      ...group,
      Id: maxId + 1,
      lastUsed: new Date().toISOString()
    };
    groups.push(newGroup);
    return { ...newGroup };
  },

  update: async (id, data) => {
    await delay();
    const index = groups.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      groups[index] = { ...groups[index], ...data };
      return { ...groups[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = groups.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      groups.splice(index, 1);
      return true;
    }
    return false;
  },

  updateLastUsed: async (id) => {
    await delay();
    const index = groups.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      groups[index].lastUsed = new Date().toISOString();
      return { ...groups[index] };
    }
    return null;
  }
};

export default groupService;