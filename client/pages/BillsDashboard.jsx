import React, { useState, useEffect } from 'react';
import { ArrowLeft, Receipt, Calendar, Plus, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import BillPaymentModal from './BillPaymentModal.jsx';

const BillsDashboard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const nav = useNavigate();

  const fetchBills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/auth/bills/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data.bills || []);
    } catch (err) {
      console.error('Failed to fetch bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePaymentSuccess = (data) => {
    fetchBills();
    alert(data.message || 'Bill payment successful!');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      SUCCESS: <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
        <CheckCircle size={14} /> Success
      </span>,
      FAILED: <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
        <XCircle size={14} /> Failed
      </span>,
      PENDING: <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
        <Clock size={14} /> Pending
      </span>
    };
    return badges[status] || badges.PENDING;
  };

  const getBillTypeIcon = (type) => {
    const icons = {
      ELECTRICITY: '⚡',
      WATER: '💧',
      PHONE: '📱',
      GAS: '🔥',
      BROADBAND: '🌐'
    };
    return icons[type] || '📄';
  };

  const getBillTypeColor = (type) => {
    const colors = {
      ELECTRICITY: 'from-yellow-500 to-orange-600',
      WATER: 'from-blue-500 to-cyan-600',
      PHONE: 'from-purple-500 to-indigo-600',
      GAS: 'from-red-500 to-pink-600',
      BROADBAND: 'from-green-500 to-emerald-600'
    };
    return colors[type] || colors.ELECTRICITY;
  };

  const totalPaid = bills.filter(b => b.status === 'SUCCESS').reduce((sum, bill) => sum + bill.amount, 0);
  const thisMonthPaid = bills.filter(b => {
    const billDate = new Date(b.paymentDate);
    const now = new Date();
    return b.status === 'SUCCESS' && 
           billDate.getMonth() === now.getMonth() && 
           billDate.getFullYear() === now.getFullYear();
  }).reduce((sum, bill) => sum + bill.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => nav('/userDashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="text-gray-600" size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Receipt className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Bill Payments</h1>
                  <p className="text-sm text-gray-600">Manage your utility bills</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPayModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus size={20} /> Pay Bill
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Bills Paid</p>
            <p className="text-3xl font-bold text-gray-800">{bills.filter(b => b.status === 'SUCCESS').length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-cyan-500">
            <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-teal-500">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-3xl font-bold text-teal-600">{formatCurrency(thisMonthPaid)}</p>
          </div>
        </div>

        {/* Quick Pay Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {['ELECTRICITY', 'WATER', 'PHONE', 'GAS', 'BROADBAND'].map((type) => (
            <button
              key={type}
              onClick={() => setShowPayModal(true)}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 border-2 border-transparent hover:border-blue-300 group`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${getBillTypeColor(type)} rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {getBillTypeIcon(type)}
              </div>
              <p className="text-xs font-semibold text-gray-700 text-center">{type}</p>
            </button>
          ))}
        </div>

        {/* Bills History */}
        {bills.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Receipt className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bill Payments Yet</h3>
            <p className="text-gray-500 mb-6">Pay your first bill to get started</p>
            <button
              onClick={() => setShowPayModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Pay Bill
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={24} className="text-blue-600" />
              Payment History
            </h2>
            <div className="space-y-4">
              {bills.map((bill) => (
                <div key={bill.id || bill._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getBillTypeColor(bill.billType)} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                        {getBillTypeIcon(bill.billType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-800 text-lg">{bill.billType}</h3>
                          {getStatusBadge(bill.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Provider: <span className="font-medium">{bill.provider}</span></p>
                        <p className="text-xs text-gray-500">Account: {bill.accountNumber}</p>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-gray-800 mb-1">
                        {formatCurrency(bill.amount)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                        <Calendar size={14} />
                        <span>{formatDate(bill.paymentDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pay Bill Modal */}
      <BillPaymentModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BillsDashboard;
