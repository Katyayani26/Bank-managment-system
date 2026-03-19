import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, User, DollarSign, Wallet, ShieldCheck, CheckCircle2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { storageService, STORAGE_KEYS } from '../services/storage';

const TransferPage = () => {
  const location = useLocation();
  const [recipientEmail, setRecipientEmail] = useState(location.state?.email || '');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'));
  const [recipients, setRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (current) {
      setUserData(current);
      // Get all accounts except the current user to show as potential recipients
      const allAccounts = storageService.getAccounts();
      setRecipients(allAccounts.filter(acc => acc.email !== current.email));
    }
  }, []);

  useEffect(() => {
    if (location.state?.email) {
      setRecipientEmail(location.state.email);
    }
  }, [location.state]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);
    
    if (!recipientEmail) {
      toast.error('Please select or enter a recipient email');
      return;
    }

    if (!amount || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transferAmount > (userData?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      storageService.transferFunds(userData.email, recipientEmail, transferAmount);
      
      // Refresh local state
      const updatedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
      setUserData(updatedUser);
      
      setSuccess(true);
      toast.success(`Successfully transferred ₹${transferAmount.toFixed(2)} to ${recipientEmail}`);
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(error.message || 'Failed to process transfer');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipients = recipients.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setRecipientEmail('');
    setAmount('');
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 min-h-screen flex flex-col">
        <Navbar user={userData} />
        
        <div className="p-8 max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Send className="text-violet-600" />
              Transfer Funds
            </h1>
            <p className="text-gray-500 text-sm">Send money to other bank accounts instantly.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!success ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="shadow-xl h-full">
                    <div className="flex items-center justify-between mb-8 p-4 bg-violet-50 rounded-xl border border-violet-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-600 rounded-lg text-white">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-violet-900 uppercase tracking-wider">Available Balance</p>
                          <p className="text-xl font-bold text-violet-700">₹{userData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleTransfer} className="space-y-6">
                      <Input
                        label="Recipient Email"
                        id="recipient"
                        type="email"
                        placeholder="recipient@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        icon={User}
                        required
                      />

                      <Input
                        label="Amount to Send"
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        icon={DollarSign}
                        required
                        error={parseFloat(amount) > (userData?.balance || 0) ? 'Amount exceeds available balance' : null}
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold bg-violet-600 hover:bg-violet-700"
                        loading={loading}
                        disabled={parseFloat(amount) > (userData?.balance || 0)}
                      >
                        Send Money Now
                      </Button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                      <ShieldCheck size={14} />
                      <span>Protected by 256-bit bank-grade encryption</span>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Card className="h-full border-none shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Select Recipient</h3>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex-grow overflow-y-auto max-h-[400px] pr-2 space-y-2 custom-scrollbar">
                      {filteredRecipients.length > 0 ? (
                        filteredRecipients.map(recipient => (
                          <button
                            key={recipient.email}
                            onClick={() => setRecipientEmail(recipient.email)}
                            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border ${recipientEmail === recipient.email ? 'bg-violet-50 border-violet-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}
                          >
                            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                              {recipient.name.charAt(0)}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-gray-900">{recipient.name}</p>
                              <p className="text-xs text-gray-500">{recipient.email}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-400 text-sm italic">No other accounts found</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-lg mx-auto"
              >
                <Card className="shadow-2xl border-green-100 bg-white p-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 size={48} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Successful!</h2>
                  <p className="text-gray-500 mb-8">
                    The amount of <span className="font-bold text-gray-900">₹{parseFloat(amount).toFixed(2)}</span> has been sent to <span className="font-bold text-gray-900">{recipientEmail}</span>.
                  </p>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-grow" onClick={resetForm}>Send More Money</Button>
                    <Button className="flex-grow bg-violet-600 hover:bg-violet-700" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default TransferPage;
