const STORAGE_PREFIX = 'nuvio_entity_';

export const dataService = {
  list: (entityName) => {
    const data = localStorage.getItem(STORAGE_PREFIX + entityName);
    return data ? JSON.parse(data) : [];
  },

  get: (entityName, id) => {
    const list = dataService.list(entityName);
    return list.find(item => item.id === id);
  },

  create: (entityName, data) => {
    const list = dataService.list(entityName);
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...data
    };
    list.push(newItem);
    localStorage.setItem(STORAGE_PREFIX + entityName, JSON.stringify(list));
    return newItem;
  },

  update: (entityName, id, data) => {
    const list = dataService.list(entityName);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_PREFIX + entityName, JSON.stringify(list));
    return list[index];
  },

  delete: (entityName, id) => {
    const list = dataService.list(entityName);
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_PREFIX + entityName, JSON.stringify(filtered));
  },

  filter: (entityName, predicate) => {
    const list = dataService.list(entityName);
    return list.filter(predicate);
  }
};
