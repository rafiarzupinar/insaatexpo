// Firebase configuration - Mock version for Expo
// TODO: Install expo-firebase and configure properly

// Mock auth service
export const authService = {
  signIn: async (email: string, password: string) => {
    // Mock implementation
    return { success: true, user: { email, uid: 'mock-uid' } };
  },

  signUp: async (email: string, password: string) => {
    return { success: true, user: { email, uid: 'mock-uid' } };
  },

  signOut: async () => {
    return { success: true };
  },

  getCurrentUser: () => null,

  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(null);
    return () => {};
  },

  resetPassword: async (email: string) => {
    return { success: true };
  },
};

// Mock Firestore
export const db = {
  collections: {
    users: 'users',
    projects: 'projects',
    tasks: 'tasks',
    budgets: 'budgets',
    expenses: 'expenses',
    workers: 'workers',
    teams: 'teams',
    materials: 'materials',
    suppliers: 'suppliers',
    equipment: 'equipment',
    checklists: 'checklists',
    incidents: 'incidents',
    riskAreas: 'riskAreas',
    reports: 'reports',
  },

  add: async (collection: string, data: any) => {
    return { success: true, id: 'mock-id-' + Date.now() };
  },

  update: async (collection: string, docId: string, data: any) => {
    return { success: true };
  },

  delete: async (collection: string, docId: string) => {
    return { success: true };
  },

  get: async (collection: string, docId: string) => {
    return { success: false, error: 'Mock - No data' };
  },

  getAll: async (collection: string, conditions?: any[]) => {
    return { success: true, data: [] };
  },

  subscribe: (collection: string, callback: (data: any[]) => void, conditions?: any[]) => {
    callback([]);
    return () => {};
  },
};

// Mock Storage
export const storageService = {
  uploadFile: async (path: string, uri: string) => {
    return { success: true, url: uri };
  },

  deleteFile: async (path: string) => {
    return { success: true };
  },

  getDownloadURL: async (path: string) => {
    return { success: true, url: path };
  },
};

export default { authService, db, storageService };
