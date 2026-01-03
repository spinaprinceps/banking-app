import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../api.js';

const FDModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    tenure: '12'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [maturityPreview, setMaturityPreview] = useState(null);

  const getInterestRate = (tenure) => {
    if (tenure >= 36) return 8.0;
    if (tenure >= 24) return 7.5;
    if (tenure >= 12) return 7.0;
    return 6.5;
  };

  const calculateMaturity = () => {
    if (!formData.amount || !formData.tenure) return;
    const principal = parseFloat(formData.amount);
    const tenure = parseInt(formData.tenure);
    const rate = getInterestRate(tenure);
    const maturity = principal * (1 + (rate * tenure) / (12 * 100));
    const interest = maturity - principal;
    
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenure);
    
    setMaturityPreview({
      maturity: Math.round(maturity),
      interest: Math.round(interest),
      rate,
      maturityDate: maturityDate.toLocaleDateString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/fd/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onSuccess(response.data);
      onClose();
      setFormData({ amount: '', tenure: '12' });
      setMaturityPreview(null);
    } catch (err) {
      console.error('FD creation error:', err);
      setError(err.response?.data?.message || err.message || 'FD creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    calculateMaturity();
  }, [formData.amount, formData.tenure]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Fixed Deposit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1000"
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Minimum ₹1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenure</label>
            <select
              value={formData.tenure}
              onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">6 Months (6.5% p.a.)</option>
              <option value="12">12 Months (7.0% p.a.)</option>
              <option value="24">24 Months (7.5% p.a.)</option>
              <option value="36">36 Months (8.0% p.a.)</option>
              <option value="60">60 Months (8.0% p.a.)</option>
            </select>
          </div>

          {maturityPreview && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="font-semibold mb-2">Maturity Details</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-bold">{maturityPreview.rate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Earned:</span>
                  <span>₹{maturityPreview.interest}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maturity Amount:</span>
                  <span className="font-bold text-green-600">₹{maturityPreview.maturity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maturity Date:</span>
                  <span>{maturityPreview.maturityDate}</span>
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
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Fixed Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FDModal;
