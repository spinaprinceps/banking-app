import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api.js';

const BillPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    billType: 'ELECTRICITY',
    provider: '',
    accountNumber: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const billProviders = {
    ELECTRICITY: ['State Power Board', 'MSEB', 'BESCOM', 'TANGEDCO'],
    WATER: ['Municipal Water Supply', 'Water Board', 'Jal Board'],
    PHONE_RECHARGE: ['Airtel', 'Jio', 'Vi', 'BSNL'],
    GAS: ['Indane', 'HP Gas', 'Bharat Gas'],
    BROADBAND: ['Airtel Fiber', 'Jio Fiber', 'ACT', 'BSNL']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/bills/pay', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess(response.data);
      onClose();
      setFormData({ billType: 'ELECTRICITY', provider: '', accountNumber: '', amount: '' });
    } catch (err) {
      console.error('Bill payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pay Bill</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bill Type</label>
            <select
              value={formData.billType}
              onChange={(e) => setFormData({ ...formData, billType: e.target.value, provider: '' })}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ELECTRICITY">Electricity</option>
              <option value="WATER">Water</option>
              <option value="PHONE_RECHARGE">Phone Recharge</option>
              <option value="GAS">Gas</option>
              <option value="BROADBAND">Broadband</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Provider</option>
              {billProviders[formData.billType].map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number / Mobile</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1"
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Bill'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillPaymentModal;
