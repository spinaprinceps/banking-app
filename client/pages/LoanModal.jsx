import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../api.js';

const LoanModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    loanType: 'PERSONAL',
    amount: '',
    tenure: '12',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emiPreview, setEmiPreview] = useState(null);

  const interestRates = {
    PERSONAL: 14,
    AGRICULTURE: 9,
    BUSINESS: 12,
    EDUCATION: 10,
    EMERGENCY: 15
  };

  const calculateEMI = () => {
    if (!formData.amount || !formData.tenure) return;
    const principal = parseFloat(formData.amount);
    const rate = interestRates[formData.loanType];
    const tenure = parseInt(formData.tenure);
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    setEmiPreview({
      emi: Math.round(emi),
      total: Math.round(emi * tenure),
      interest: Math.round((emi * tenure) - principal)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/loans/apply', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess(response.data);
      onClose();
      setFormData({ loanType: 'PERSONAL', amount: '', tenure: '12', purpose: '' });
      setEmiPreview(null);
    } catch (err) {
      console.error('Loan application error:', err);
      setError(err.response?.data?.message || err.message || 'Loan application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    calculateEMI();
  }, [formData.amount, formData.tenure, formData.loanType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for Loan</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
            <select
              value={formData.loanType}
              onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="PERSONAL">Personal Loan ({interestRates.PERSONAL}%)</option>
              <option value="AGRICULTURE">Agriculture Loan ({interestRates.AGRICULTURE}%)</option>
              <option value="BUSINESS">Business Loan ({interestRates.BUSINESS}%)</option>
              <option value="EDUCATION">Education Loan ({interestRates.EDUCATION}%)</option>
              <option value="EMERGENCY">Emergency Loan ({interestRates.EMERGENCY}%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1000"
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Minimum ₹1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Months)</label>
            <select
              value={formData.tenure}
              onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
              <option value="48">48 Months</option>
              <option value="60">60 Months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              rows="3"
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe loan purpose"
            />
          </div>

          {emiPreview && (
            <div className="bg-green-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">EMI Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Monthly EMI:</span>
                  <span className="font-bold">₹{emiPreview.emi}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest:</span>
                  <span>₹{emiPreview.interest}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Repayment:</span>
                  <span className="font-bold">₹{emiPreview.total}</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Apply for Loan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanModal;
