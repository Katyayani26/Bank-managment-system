import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  Clock, 
  Check, 
  X, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Filter, 
  ArrowRight,
  User as UserIcon,
  Mail,
  Calendar,
  CreditCard,
  Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { storageService, STORAGE_KEYS } from '../services/storage';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'accounts'
  const [requests, setRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({ users: 0, accounts: 0, pending: 0 });
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const storedRequests = storageService.getRequests();
        const storedAccounts = storageService.getAccounts();
        const storedAdmins = storageService.getAdmins();
        
        setRequests(storedRequests);
        setAccounts(storedAccounts);
        setStats({ 
          users: storedAccounts.length, 
          accounts: storedAccounts.length, 
          pending: storedRequests.length 
        });
        
        // Refresh userData if it changed in localStorage
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
        if (current) setUserData(current);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleApprove = (id) => {
    const request = requests.find(req => req.id === id);
    if (!request) return;

    const storedAccounts = storageService.getAccounts();
    const storedRequests = storageService.getRequests();

    // Create new account
    const newAccount = {
      id: `acc-${Date.now()}`,
      name: request.name,
      email: request.email,
      password: request.password, // Carry over the password from request
      type: request.type,
      balance: 0.00,
      status: 'Active',
      joined: new Date().toISOString().split('T')[0]
    };

    const updatedAccounts = [newAccount, ...storedAccounts];
    const updatedRequests = storedRequests.filter(req => req.id !== id);

    // Save back to storage using storageService directly
    storageService.saveData(STORAGE_KEYS.ACCOUNTS, updatedAccounts);
    storageService.saveData(STORAGE_KEYS.REQUESTS, updatedRequests);

    // Update local state
    setAccounts(updatedAccounts);
    setRequests(updatedRequests);
    setStats(prev => ({ 
      ...prev, 
      pending: updatedRequests.length, 
      accounts: updatedAccounts.length,
      users: updatedAccounts.length
    }));
    
    toast.success(`${request.name}'s account approved!`);
  };

  const handleReject = (id) => {
    const storedRequests = storageService.getRequests();
    const request = requests.find(req => req.id === id);
    const updatedRequests = storedRequests.filter(req => req.id !== id);

    storageService.saveData(STORAGE_KEYS.REQUESTS, updatedRequests);

    setRequests(updatedRequests);
    setStats(prev => ({ ...prev, pending: updatedRequests.length }));
    toast.error(`Request from ${request?.name || 'User'} rejected`);
  };

  const requestColumns = [
    {
      header: 'Customer',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.name}</span>
            <span className="text-xs text-slate-500 font-medium">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      key: 'type',
      render: (row) => (
        <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
          {row.type}
        </span>
      )
    },
    {
      header: 'Date',
      key: 'date',
      render: (row) => <span className="text-xs font-bold text-slate-500">{row.date}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button 
            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            onClick={() => handleApprove(row.id)}
            title="Approve"
          >
            <Check size={18} />
          </button>
          <button 
            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
            onClick={() => handleReject(row.id)}
            title="Reject"
          >
            <X size={18} />
          </button>
        </div>
      )
    }
  ];

  const accountColumns = [
    {
      header: 'Customer',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.name}</span>
            <span className="text-xs text-slate-500 font-medium">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Balance',
      key: 'balance',
      render: (row) => (
        <span className="text-sm font-black text-slate-900">
          ₹{row.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
          {row.status}
        </span>
      )
    },
    {
      header: 'Joined',
      key: 'joined',
      render: (row) => <span className="text-xs font-bold text-slate-500">{row.joined}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <button 
          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          onClick={() => setSelectedAccount(row)}
          title="View Details"
        >
          <Eye size={18} />
        </button>
      )
    }
  ];

  const statCards = [
    { name: 'Total Users', value: stats.users.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Accounts', value: stats.accounts.toLocaleString(), icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Pending Approvals', value: stats.pending.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-['Inter']">
      <Sidebar isAdmin={true} />
      
      <main className="flex-grow ml-64 min-h-screen flex flex-col transition-all duration-300">
        <Navbar user={userData} />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <ShieldCheck size={24} />
                </div>
                Admin Control Panel
              </h1>
              <p className="text-slate-500 font-medium mt-1">Manage system accounts and monitor bank operations.</p>
            </div>
            
            <div className="flex gap-2 bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-slate-100">
              <button 
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Requests ({requests.length})
              </button>
              <button 
                onClick={() => setActiveTab('accounts')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'accounts' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Accounts ({accounts.length})
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statCards.map((stat, idx) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-0 border-none shadow-sm hover-lift">
                  <div className="flex items-center gap-5 p-8">
                    <div className={`w-14 h-14 rounded-[1.25rem] ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="border-none shadow-sm"
              title={activeTab === 'requests' ? 'Pending Authorizations' : 'Global Account Registry'}
              subtitle={activeTab === 'requests' ? 'New account applications requiring review' : 'Overview of all active accounts in the system'}
              titleAction={
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Quick search..."
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all w-48"
                    />
                  </div>
                  <Button variant="ghost" className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100">
                    <Filter size={18} className="text-slate-600" />
                  </Button>
                </div>
              }
            >
              {loading ? (
                <div className="py-20"><LoadingSpinner message="Accessing secure database..." /></div>
              ) : (
                <Table 
                  columns={activeTab === 'requests' ? requestColumns : accountColumns} 
                  data={activeTab === 'requests' ? requests : accounts} 
                  emptyMessage={activeTab === 'requests' ? "No pending authorizations found." : "No accounts registered in the system."}
                />
              )}
            </Card>
          </motion.div>
        </div>

        {/* Account Details Modal */}
        <AnimatePresence>
          {selectedAccount && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAccount(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20"
              >
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-blue-400 font-black text-2xl">
                        {selectedAccount.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">{selectedAccount.name}</h2>
                        <p className="text-slate-400 text-sm font-medium">{selectedAccount.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedAccount(null)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Balance</p>
                      <p className="text-xl font-black tracking-tight">₹{selectedAccount.balance.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Type</p>
                      <p className="text-xl font-black tracking-tight">{selectedAccount.type}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Account Metadata</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'System ID', value: selectedAccount.id, icon: Terminal },
                      { label: 'Verification Status', value: selectedAccount.status, icon: ShieldCheck, color: 'text-emerald-600' },
                      { label: 'Joined Date', value: selectedAccount.joined, icon: Calendar },
                      { label: 'Virtual Card', value: 'Active (**** 8241)', icon: CreditCard },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className="text-slate-400" />
                          <span className="text-sm font-bold text-slate-600">{item.label}</span>
                        </div>
                        <span className={`text-sm font-black ${item.color || 'text-slate-900'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
                    <Button variant="outline" className="flex-grow rounded-2xl font-black uppercase text-xs tracking-widest py-4 border-slate-200">
                      Restrict Access
                    </Button>
                    <Button className="flex-grow rounded-2xl font-black uppercase text-xs tracking-widest py-4 bg-slate-900">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
