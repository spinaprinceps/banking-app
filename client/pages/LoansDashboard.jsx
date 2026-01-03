import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Calendar, DollarSign, Plus, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import LoanModal from './LoanModal.jsx';

const LoansDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [repaymentAmounts, setRepaymentAmounts] = useState({});
  const nav = useNavigate();

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/auth/loans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Loans fetched:', response.data);
      setLoans(response.data.loans || []);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApplySuccess = (data) => {
    fetchLoans();
    alert(data.message || 'Loan application submitted successfully!');
  };

  const handleRepayment = async (loanId) => {
    const amount = parseFloat(repaymentAmounts[loanId] || 0);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/auth/loans/${loanId}/repay`, 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || 'Repayment successful!');
      setRepaymentAmounts({ ...repaymentAmounts, [loanId]: '' });
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Repayment failed');
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
      PENDING: <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
        <Clock size={14} /> Pending
      </span>,
      APPROVED: <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
        <CheckCircle size={14} /> Approved
      </span>,
      ACTIVE: <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
        <TrendingUp size={14} /> Active
      </span>,
      COMPLETED: <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
        <CheckCircle size={14} /> Completed
      </span>,
      REJECTED: <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
        <XCircle size={14} /> Rejected
      </span>
    };
    return badges[status] || badges.PENDING;
  };

  const getLoanTypeColor = (type) => {
    const colors = {
      PERSONAL: 'from-purple-500 to-indigo-600',
      AGRICULTURE: 'from-green-500 to-emerald-600',
      BUSINESS: 'from-blue-500 to-cyan-600',
      EDUCATION: 'from-orange-500 to-amber-600',
      EMERGENCY: 'from-red-500 to-pink-600'
    };
    return colors[type] || colors.PERSONAL;
  };

  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalOutstanding = loans.filter(l => l.status === 'ACTIVE' || l.status === 'APPROVED').reduce((sum, loan) => sum + (loan.totalRepayment - loan.amountPaid), 0);
  const activeLoans = loans.filter(l => l.status === 'ACTIVE' || l.status === 'APPROVED').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
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
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">My Loans</h1>
                  <p className="text-sm text-gray-600">Manage your loan applications</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus size={20} /> Apply for Loan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-teal-500">
            <p className="text-sm text-gray-600 mb-1">Active Loans</p>
            <p className="text-3xl font-bold text-gray-800">{activeLoans}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Total Borrowed</p>
            <p className="text-3xl font-bold text-teal-600">{formatCurrency(totalBorrowed)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">Outstanding Amount</p>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(totalOutstanding)}</p>
          </div>
        </div>

        {/* Loans List */}
        {loans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <CreditCard className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Loans Yet</h3>
            <p className="text-gray-500 mb-6">Apply for your first loan to get started</p>
            <button
              onClick={() => setShowApplyModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Apply for Loan
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {loans.map((loan) => {
              const remainingAmount = loan.totalRepayment - loan.amountPaid;
              const progressPercentage = (loan.amountPaid / loan.totalRepayment) * 100;
              
              return (
                <div key={loan.id || loan._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getLoanTypeColor(loan.loanType)} rounded-xl flex items-center justify-center`}>
                        <CreditCard className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{loan.loanType}</h3>
                        <p className="text-xs text-gray-500">Loan #{(loan.id || loan._id).toString().slice(-8)}</p>
                      </div>
                    </div>
                    {getStatusBadge(loan.status)}
                  </div>

                  {loan.purpose && (
                    <div className="mb-4 bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Purpose</p>
                      <p className="text-sm text-gray-700 font-medium">{loan.purpose}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                      <p className="text-lg font-bold text-teal-600">{loan.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Monthly EMI</p>
                      <p className="text-md font-semibold text-gray-700">{formatCurrency(loan.monthlyEMI)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tenure</p>
                      <p className="text-md font-semibold text-gray-700">{loan.tenure} months</p>
                    </div>
                  </div>

                  {loan.status === 'PENDING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-yellow-700">
                        ⏳ Application under review. You'll be notified once approved.
                      </p>
                    </div>
                  )}

                  {(loan.status === 'ACTIVE' || loan.status === 'APPROVED') && (
                    <>
                      {/* Repayment Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Repayment Progress</span>
                          <span className="font-semibold text-gray-800">{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r ${getLoanTypeColor(loan.loanType)} transition-all`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                          <p className="text-md font-bold text-green-600">{formatCurrency(loan.amountPaid)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Remaining</p>
                          <p className="text-md font-bold text-orange-600">{formatCurrency(remainingAmount)}</p>
                        </div>
                      </div>

                      {/* Repayment Section */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Repayment Amount"
                            value={repaymentAmounts[loan.id || loan._id] || ''}
                            onChange={(e) => setRepaymentAmounts({ 
                              ...repaymentAmounts, 
                              [loan.id || loan._id]: e.target.value 
                            })}
                            className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <button
                            onClick={() => handleRepayment(loan.id || loan._id)}
                            className={`px-4 py-2 bg-gradient-to-r ${getLoanTypeColor(loan.loanType)} text-white rounded-lg hover:shadow-md transition-all font-medium`}
                          >
                            Pay
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setRepaymentAmounts({ ...repaymentAmounts, [loan.id || loan._id]: loan.monthlyEMI.toString() });
                          }}
                          className="w-full py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-all font-medium text-sm"
                        >
                          Pay EMI ({formatCurrency(loan.monthlyEMI)})
                        </button>
                      </div>
                    </>
                  )}

                  {loan.status === 'COMPLETED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-semibold">
                        ✅ Loan fully repaid on {loan.completionDate ? formatDate(loan.completionDate) : 'N/A'}
                      </p>
                    </div>
                  )}

                  {loan.status === 'REJECTED' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">
                        ❌ Application rejected. Please contact support for details.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                    <Calendar size={16} />
                    <span>Applied: {loan.applicationDate ? formatDate(loan.applicationDate) : 'N/A'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Loan Modal */}
      <LoanModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={handleApplySuccess}
      />
    </div>
  );
};

export default LoansDashboard;
