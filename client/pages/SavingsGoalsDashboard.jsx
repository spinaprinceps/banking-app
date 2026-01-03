import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, TrendingUp, Calendar, Plus, Trash2, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import SavingsGoalModal from './SavingsGoalModal.jsx';

const SavingsGoalsDashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [contributionAmounts, setContributionAmounts] = useState({});
  const nav = useNavigate();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/auth/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data.goals || []);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateSuccess = (data) => {
    fetchGoals();
    alert(data.message || 'Goal created successfully!');
  };

  const handleContribute = async (goalId) => {
    const amount = parseFloat(contributionAmounts[goalId] || 0);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/auth/goals/${goalId}/contribute`, 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || 'Contribution successful!');
      setContributionAmounts({ ...contributionAmounts, [goalId]: '' });
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Contribution failed');
    }
  };

  const handleDelete = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/auth/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message || 'Goal deleted successfully!');
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete goal');
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

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category) => {
    const colors = {
      EDUCATION: 'from-blue-500 to-cyan-600',
      HEALTH: 'from-red-500 to-pink-600',
      FESTIVAL: 'from-orange-500 to-yellow-600',
      EMERGENCY: 'from-purple-500 to-indigo-600',
      AGRICULTURE: 'from-green-500 to-emerald-600',
      OTHER: 'from-gray-500 to-slate-600'
    };
    return colors[category] || colors.OTHER;
  };

  const getCategoryIcon = (category) => {
    return category.charAt(0);
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const activeGoals = goals.filter(g => g.status === 'ACTIVE').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
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
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Savings Goals</h1>
                  <p className="text-sm text-gray-600">Track your savings journey</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              <Plus size={20} /> Create New Goal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-pink-500">
            <p className="text-sm text-gray-600 mb-1">Active Goals</p>
            <p className="text-3xl font-bold text-gray-800">{activeGoals}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Total Saved</p>
            <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSaved)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500">
            <p className="text-sm text-gray-600 mb-1">Total Target</p>
            <p className="text-3xl font-bold text-indigo-600">{formatCurrency(totalTarget)}</p>
          </div>
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Target className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Savings Goals Yet</h3>
            <p className="text-gray-500 mb-6">Create your first goal to start saving</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
            >
              Create Goal
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const remaining = goal.targetAmount - goal.currentAmount;
              const isCompleted = goal.status === 'COMPLETED';
              
              return (
                <div key={goal.id || goal._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(goal.category)} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{goal.goalName}</h3>
                        <p className="text-xs text-gray-500">{goal.category}</p>
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        ✅ Completed
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-800">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getCategoryColor(goal.category)} transition-all`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Savings</p>
                      <p className="text-lg font-bold text-purple-600">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target Amount</p>
                      <p className="text-lg font-bold text-gray-800">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{formatCurrency(remaining)}</span> remaining to reach goal
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <Calendar size={16} />
                    <span>Target Date: {formatDate(goal.targetDate)}</span>
                  </div>

                  {/* Contribute Section */}
                  {!isCompleted && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={contributionAmounts[goal.id || goal._id] || ''}
                          onChange={(e) => setContributionAmounts({ 
                            ...contributionAmounts, 
                            [goal.id || goal._id]: e.target.value 
                          })}
                          className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => handleContribute(goal.id || goal._id)}
                          className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(goal.category)} text-white rounded-lg hover:shadow-md transition-all font-medium`}
                        >
                          Add
                        </button>
                      </div>
                      <button
                        onClick={() => handleDelete(goal.id || goal._id)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                      >
                        <Trash2 size={16} /> Delete Goal
                      </button>
                    </div>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => handleDelete(goal.id || goal._id)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <SavingsGoalModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default SavingsGoalsDashboard;
