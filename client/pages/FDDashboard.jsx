import React, { useState, useEffect } from 'react';
import { ArrowLeft, Landmark, Calendar, TrendingUp, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import FDModal from './FDModal.jsx';

const FDDashboard = () => {
  const [fds, setFds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const nav = useNavigate();

  const fetchFDs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/auth/fd', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('FDs fetched:', response.data);
      setFds(response.data.fds || response.data.fixedDeposits || []);
    } catch (err) {
      console.error('Failed to fetch FDs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFDs();
  }, []);

  const handleCreateSuccess = (data) => {
    fetchFDs();
    alert(data.message || 'FD created successfully!');
  };

  const handleClose = async (fdId) => {
    if (!confirm('Are you sure you want to close this FD? Amount will be credited to your account.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/auth/fd/${fdId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message || 'FD closed successfully!');
      fetchFDs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close FD');
    }
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
      ACTIVE: <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
        <CheckCircle size={14} /> Active
      </span>,
      MATURED: <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
        <Clock size={14} /> Matured
      </span>,
      CLOSED: <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
        <XCircle size={14} /> Closed
      </span>
    };
    return badges[status] || badges.ACTIVE;
  };

  const calculateDaysRemaining = (maturityDate) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalInvested = fds.filter(fd => fd.status === 'ACTIVE').reduce((sum, fd) => sum + fd.amount, 0);
  const totalMaturity = fds.filter(fd => fd.status === 'ACTIVE').reduce((sum, fd) => sum + fd.maturityAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Landmark className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Fixed Deposits</h1>
                  <p className="text-sm text-gray-600">Manage your FDs</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus size={20} /> Create New FD
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 mb-1">Total Active FDs</p>
            <p className="text-3xl font-bold text-gray-800">{fds.filter(fd => fd.status === 'ACTIVE').length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Invested</p>
            <p className="text-3xl font-bold text-indigo-600">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Expected Maturity</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalMaturity)}</p>
          </div>
        </div>

        {/* FD List */}
        {fds.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Landmark className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Fixed Deposits Yet</h3>
            <p className="text-gray-500 mb-6">Create your first FD to start earning interest</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Create FD
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {fds.map((fd) => {
              const daysRemaining = calculateDaysRemaining(fd.maturityDate);
              const isMatured = daysRemaining <= 0;
              
              return (
                <div key={fd.id || fd._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Landmark className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">FD Account</p>
                        <p className="font-semibold text-gray-800">#{(fd.id || fd._id).toString().slice(-8)}</p>
                      </div>
                    </div>
                    {getStatusBadge(fd.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Principal Amount</p>
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(fd.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Maturity Amount</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(fd.maturityAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                      <p className="text-md font-semibold text-indigo-600">{fd.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tenure</p>
                      <p className="text-md font-semibold text-gray-700">{fd.tenure} months</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>Started: {formatDate(fd.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp size={16} />
                      <span>Matures: {formatDate(fd.maturityDate)}</span>
                    </div>
                  </div>

                  {fd.status === 'ACTIVE' && (
                    <div className="mt-4">
                      {isMatured ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-green-700 font-semibold">✅ FD has matured! You can close it now.</p>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-blue-700">
                            <span className="font-semibold">{daysRemaining} days</span> remaining until maturity
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => handleClose(fd.id || fd._id)}
                        className="w-full py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-md transition-all font-medium text-sm"
                      >
                        Close FD {isMatured ? '& Withdraw' : '(Premature)'}
                      </button>
                    </div>
                  )}

                  {fd.status === 'CLOSED' && fd.closedDate && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-600">Closed on: {formatDate(fd.closedDate)}</p>
                      <p className="text-xs text-gray-600">Final Amount: {formatCurrency(fd.finalAmount || fd.maturityAmount)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create FD Modal */}
      <FDModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default FDDashboard;
