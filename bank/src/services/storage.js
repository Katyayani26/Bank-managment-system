// Data keys for localStorage
export const STORAGE_KEYS = {
  ADMINS: 'bank_admins',
  ACCOUNTS: 'bank_accounts',
  REQUESTS: 'bank_requests',
  TRANSACTIONS: 'bank_transactions',
  GOALS: 'bank_goals',
  CURRENT_USER: 'user',
  TOKEN: 'token'
};

export const storageService = {
  // Generic getters
  getData: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  
  // Save operations
  saveData: (key, data) => localStorage.setItem(key, JSON.stringify(data)),

  // Specialized helpers
  getAdmins: () => storageService.getData(STORAGE_KEYS.ADMINS),
  getAccounts: () => storageService.getData(STORAGE_KEYS.ACCOUNTS),
  getRequests: () => storageService.getData(STORAGE_KEYS.REQUESTS),
  getGoals: (email) => {
    const all = storageService.getData(STORAGE_KEYS.GOALS);
    return email ? all.filter(g => g.userEmail === email) : all;
  },
  getTransactions: (email) => {
    const all = storageService.getData(STORAGE_KEYS.TRANSACTIONS);
    return email ? all.filter(t => t.userEmail === email) : all;
  },

  addGoal: (goal) => {
    const all = storageService.getData(STORAGE_KEYS.GOALS);
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      current: 0
    };
    storageService.saveData(STORAGE_KEYS.GOALS, [...all, newGoal]);
    return newGoal;
  },

  updateGoal: (goalId, currentAmount) => {
    const all = storageService.getData(STORAGE_KEYS.GOALS);
    const updated = all.map(g => g.id === goalId ? { ...g, current: currentAmount } : g);
    storageService.saveData(STORAGE_KEYS.GOALS, updated);
  },

  addRequest: (request) => {
    const requests = storageService.getRequests();
    storageService.saveData(STORAGE_KEYS.REQUESTS, [...requests, { ...request, id: `req-${Date.now()}`, date: new Date().toISOString().split('T')[0], status: 'Pending' }]);
  },

  addAdmin: (admin) => {
    const admins = storageService.getAdmins();
    storageService.saveData(STORAGE_KEYS.ADMINS, [...admins, { ...admin, id: `admin-${Date.now()}`, role: 'Admin' }]);
  },

  addTransaction: (transaction) => {
    const all = storageService.getData(STORAGE_KEYS.TRANSACTIONS);
    const newTx = {
      ...transaction,
      id: `tx-${Date.now()}`,
      date: new Date().toLocaleString(),
      status: 'Completed'
    };
    storageService.saveData(STORAGE_KEYS.TRANSACTIONS, [newTx, ...all]);
    return newTx;
  },

  updateAccountBalance: (email, newBalance) => {
    const accounts = storageService.getAccounts();
    const updated = accounts.map(acc => 
      acc.email === email ? { ...acc, balance: newBalance } : acc
    );
    storageService.saveData(STORAGE_KEYS.ACCOUNTS, updated);
    
    // Also update current session if it's the logged in user
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (currentUser && currentUser.email === email) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({ ...currentUser, balance: newBalance }));
    }
  },

  transferFunds: (fromEmail, toEmail, amount) => {
    const accounts = storageService.getAccounts();
    const sender = accounts.find(a => a.email === fromEmail);
    const receiver = accounts.find(a => a.email === toEmail);

    if (!sender || !receiver) throw new Error('Account not found');
    if (sender.balance < amount) throw new Error('Insufficient balance');

    // Update balances
    storageService.updateAccountBalance(fromEmail, sender.balance - amount);
    storageService.updateAccountBalance(toEmail, (receiver.balance || 0) + amount);

    // Log transaction for sender
    storageService.addTransaction({
      userEmail: fromEmail,
      userName: sender.name,
      type: 'Transfer',
      category: `Sent to ${receiver.name}`,
      amount: -amount,
      balance: sender.balance - amount,
      recipientEmail: toEmail,
      recipientName: receiver.name,
      icon: '💸'
    });

    // Log transaction for receiver
    storageService.addTransaction({
      userEmail: toEmail,
      userName: receiver.name,
      type: 'Transfer',
      category: `Received from ${sender.name}`,
      amount: amount,
      balance: (receiver.balance || 0) + amount,
      senderEmail: fromEmail,
      senderName: sender.name,
      icon: '💰'
    });
  }
};
