import React, { useState, useEffect } from 'react';
import { History, Download, Filter, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

import { storageService, STORAGE_KEYS } from '../services/storage';

const TransactionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'));

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
        if (current) {
          setUserData(current);
          const realTransactions = storageService.getTransactions(current.email);
          setTransactions(realTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const columns = [
    {
      header: 'Date & Time',
      key: 'date',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.date.split(' ')[0]}</span>
          <span className="text-xs text-gray-500">{row.date.split(' ')[1]}</span>
        </div>
      )
    },
    {
      header: 'Type',
      key: 'type',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.type === 'Deposit' ? (
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <ArrowDownLeft size={16} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <ArrowUpRight size={16} />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{row.type}</span>
            <span className="text-xs text-gray-500">{row.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (row) => (
        <span className={`font-bold ${row.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
          {row.amount > 0 ? '+' : ''}{row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Balance',
      key: 'balance',
      render: (row) => (
        <span className="font-medium text-gray-600">
          ₹{row.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-grow ml-64 min-h-screen flex flex-col">
        <Navbar user={userData} />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <History className="text-blue-600" />
                Transaction History
              </h1>
              <p className="text-gray-500 text-sm">View and manage all your account transactions.</p>
            </motion.div>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2 text-xs font-bold uppercase">
                <Filter size={14} />
                Filter
              </Button>
              <Button variant="primary" className="flex items-center gap-2 text-xs font-bold uppercase">
                <Download size={14} />
                Export CSV
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, category or amount..."
                  className="block w-full px-3 py-2.5 pl-10 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching transactions..." />
            ) : (
              <Table 
                columns={columns} 
                data={transactions} 
                emptyMessage="No transactions found for the selected period."
              />
            )}

            {!loading && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">7</span> transactions</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="px-3 py-1" disabled>Previous</Button>
                  <Button variant="outline" className="px-3 py-1" disabled>Next</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TransactionsPage;
