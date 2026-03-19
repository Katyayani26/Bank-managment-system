import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpCircle, DollarSign, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { storageService, STORAGE_KEYS } from '../services/storage';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'));
  const navigate = useNavigate();

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
    if (current) setUserData(current);
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const depositAmount = parseFloat(amount);
      const newBalance = (userData?.balance || 0) + depositAmount;
      
      // Use storage service to persist changes
      storageService.updateAccountBalance(userData.email, newBalance);
      
      // Add to transaction history
      storageService.addTransaction({
        userEmail: userData.email,
        userName: userData.name,
        type: 'Deposit',
        category: 'Personal Deposit',
        amount: depositAmount,
        balance: newBalance,
        icon: '💰'
      });

      // Refresh local user data from storage
      const updatedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
      setUserData(updatedUser);
      
      setSuccess(true);
      toast.success(`Successfully deposited $${depositAmount.toFixed(2)}`);
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to process deposit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 min-h-screen flex flex-col">
        <Navbar user={userData} />
        
        <div className="p-8 max-w-2xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowUpCircle className="text-green-600" />
              Deposit Funds
            </h1>
            <p className="text-gray-500 text-sm">Add money to your account securely.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="shadow-xl">
                  <div className="flex items-center justify-between mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Current Balance</p>
                          <p className="text-xl font-bold text-blue-700">₹{userData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                  </div>

                  <form onSubmit={handleDeposit} className="space-y-6">
                    <Input
                      label="Deposit Amount"
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      icon={DollarSign}
                      required
                    />

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction Details</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="text-gray-900 font-medium">₹0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Deposit</span>
                        <span className="text-gray-900 font-bold text-lg">₹{parseFloat(amount || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-bold"
                      loading={loading}
                    >
                      Process Deposit
                    </Button>
                  </form>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <ShieldCheck size={14} />
                    <span>Your transaction is encrypted and secure</span>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="shadow-2xl border-green-100 bg-white p-12">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <CheckCircle2 size={48} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Successful!</h2>
                  <p className="text-gray-500 mb-8">The amount of <span className="font-bold text-gray-900">₹{parseFloat(amount).toFixed(2)}</span> has been added to your account.</p>
                  
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-grow" onClick={resetForm}>Make Another Deposit</Button>
                    <Button className="flex-grow" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
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

export default DepositPage;
