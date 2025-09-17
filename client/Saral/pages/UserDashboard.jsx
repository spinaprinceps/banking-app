import React, { useState, useEffect } from 'react';
import { User, Eye, EyeOff, History, Send, ArrowLeft, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js'
const UserDashboard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const nav=useNavigate();

  // const [userData] = useState({
  //   name: "Ravi Kumar",
  //   aadhaar: "123456789012",
  //   mobile: "9876543210",
  //   balance: 25750.50
  // });

  // Sample transaction data (in real app, this would come from API)
  const [transactions] = useState([
    {
      id: 1,
      sender: "9876543210",
      receiver: "8765432109",
      amount: 500.00,
      status: "completed",
      date: "2024-09-15",
      time: "14:30",
      type: "sent"
    },
    {
      id: 2,
      sender: "7654321098",
      receiver: "9876543210",
      amount: 1200.00,
      status: "completed",
      date: "2024-09-14",
      time: "10:15",
      type: "received"
    },
    {
      id: 3,
      sender: "9876543210",
      receiver: "6543210987",
      amount: 750.00,
      status: "pending",
      date: "2024-09-13",
      time: "16:45",
      type: "sent"
    },
    {
      id: 4,
      sender: "5432109876",
      receiver: "9876543210",
      amount: 2000.00,
      status: "failed",
      date: "2024-09-12",
      time: "09:20",
      type: "received"
    },
    {
      id: 5,
      sender: "9876543210",
      receiver: "4321098765",
      amount: 300.00,
      status: "completed",
      date: "2024-09-11",
      time: "18:30",
      type: "sent"
    }
  ]);

  const lang= localStorage.getItem("appLanguage")
  const [currentLanguage] = useState(lang);

  const translations = {
  english: {
    title: "Dashboard",
    welcome: "Welcome back",
    userIdentity: "User Identity",
    aadhaarNumber: "Aadhaar Number",
    mobileNumber: "Mobile Number",
    services: "Banking Services",
    checkBalance: "Check Balance",
    transactionHistory: "Transaction History",
    newPayment: "New Payment",
    currentBalance: "Current Balance",
    showBalance: "Show Balance",
    hideBalance: "Hide Balance",
    viewHistory: "View History",
    hideHistory: "Hide History",
    makePayment: "Make Payment",
    noTransactions: "No transactions found",
    transactionDetails: {
      sender: "Sender",
      receiver: "Receiver",
      amount: "Amount",
      status: "Status",
      date: "Date",
      time: "Time"
    },
    status: {
      completed: "Completed",
      pending: "Pending",
      failed: "Failed"
    },
    bankName: "GramSeva Bank"
  },

  hindi: {
    title: "डैशबोर्ड",
    welcome: "वापसी पर स्वागत है",
    userIdentity: "उपयोगकर्ता पहचान",
    aadhaarNumber: "आधार संख्या",
    mobileNumber: "मोबाइल नंबर",
    services: "बैंकिंग सेवाएँ",
    checkBalance: "बैलेंस जाँचें",
    transactionHistory: "लेनदेन इतिहास",
    newPayment: "नया भुगतान",
    currentBalance: "वर्तमान बैलेंस",
    showBalance: "बैलेंस दिखाएँ",
    hideBalance: "बैलेंस छिपाएँ",
    viewHistory: "इतिहास देखें",
    hideHistory: "इतिहास छिपाएँ",
    makePayment: "भुगतान करें",
    noTransactions: "कोई लेनदेन नहीं मिला",
    transactionDetails: {
      sender: "प्रेषक",
      receiver: "प्राप्तकर्ता",
      amount: "राशि",
      status: "स्थिति",
      date: "तारीख",
      time: "समय"
    },
    status: {
      completed: "पूर्ण",
      pending: "लंबित",
      failed: "असफल"
    },
    bankName: "ग्रामसेवा बैंक"
  },

  kannada: {
    title: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
    userIdentity: "ಬಳಕೆದಾರರ ಗುರುತು",
    aadhaarNumber: "ಆಧಾರ್ ಸಂಖ್ಯೆ",
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    services: "ಬ್ಯಾಂಕಿಂಗ್ ಸೇವೆಗಳು",
    checkBalance: "ಬಾಕಿ ಪರಿಶೀಲಿಸಿ",
    transactionHistory: "ವ್ಯವಹಾರ ಇತಿಹಾಸ",
    newPayment: "ಹೊಸ ಪಾವತಿ",
    currentBalance: "ಪ್ರಸ್ತುತ ಬಾಕಿ",
    showBalance: "ಬಾಕಿ ತೋರಿಸಿ",
    hideBalance: "ಬಾಕಿ ಮರೆಮಾಡಿ",
    viewHistory: "ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ",
    hideHistory: "ಇತಿಹಾಸ ಮರೆಮಾಡಿ",
    makePayment: "ಪಾವತಿ ಮಾಡಿ",
    noTransactions: "ಯಾವುದೇ ವ್ಯವಹಾರಗಳು ಸಿಗಲಿಲ್ಲ",
    transactionDetails: {
      sender: "ಕಳುಹಿಸಿದವರು",
      receiver: "ಸ್ವೀಕರಿಸಿದವರು",
      amount: "ಮೊತ್ತ",
      status: "ಸ್ಥಿತಿ",
      date: "ದಿನಾಂಕ",
      time: "ಸಮಯ"
    },
    status: {
      completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      pending: "ಬಾಕಿ",
      failed: "ವಿಫಲವಾಗಿದೆ"
    },
    bankName: "ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್"
  }
};



const t = translations[currentLanguage];

useEffect(() => {
  const fetchIdentity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        nav("/"); // redirect to login if no token
        return;
      }

      const res = await api.get("/auth/identity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.user); // depends on how backend sends it
    } catch (err) {
      console.error("Failed to fetch identity:", err);
      //localStorage.removeItem("token");
      nav("/userDashboard"); // logout on failure
    } finally {
      setLoading(false);
    }
  };

  fetchIdentity();
}, [nav]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'pending':
        return <AlertCircle className="text-yellow-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const maskAadhaar = (aadhaar) => {
    return `XXXX XXXX ${aadhaar.slice(-4)}`;
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Navigate to login page
    localStorage.removeItem("token");
    nav("/")
  };

  const navigateToNewPayment = () => {
    console.log('Navigate to new payment page');
    // In real app, this would use router to navigate
  };
if (loading) return <div>Loading...</div>;  // show while fetching
if (!userData) return <div>No user data found</div>; // fallback
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t.bankName}</h1>
                <p className="text-sm text-gray-600">{t.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{userData.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600" />
                  <span className="font-medium">{userData.name}</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {t.welcome}, {userData.name}!
          </h2>
          <p className="text-gray-600">Manage your banking needs with ease</p>
        </div>

        {/* User Identity Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User className="mr-2 text-green-600" size={24} />
            {t.userIdentity}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-green-700 mb-2">
                {t.aadhaarNumber}
              </label>
              <p className="text-lg font-semibold text-green-800 font-mono">
                {maskAadhaar(userData.aadhar)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-xl">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                {t.mobileNumber}
              </label>
              <p className="text-lg font-semibold text-blue-800 font-mono">
                +91 {userData.mobile}
              </p>
            </div>
          </div>
        </div>

        {/* Banking Services */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{t.services}</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Check Balance Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{t.checkBalance}</h4>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Eye className="text-green-600" size={24} />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.currentBalance}
                </label>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-gray-800">
                    {showBalance ? formatCurrency(userData.balance) : '••••••'}
                  </div>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={showBalance ? t.hideBalance : t.showBalance}
                  >
                    {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Transaction History Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{t.transactionHistory}</h4>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <History className="text-blue-600" size={24} />
                </div>
              </div>
              
              <button
                onClick={() => setShowTransactionHistory(!showTransactionHistory)}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {showTransactionHistory ? t.hideHistory : t.viewHistory}
              </button>
            </div>

            {/* New Payment Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{t.newPayment}</h4>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Send className="text-purple-600" size={24} />
                </div>
              </div>
              
              <button
                onClick={navigateToNewPayment}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                {t.makePayment}
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        {showTransactionHistory && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <History className="mr-2 text-blue-600" size={24} />
              {t.transactionHistory}
            </h3>
            
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t.noTransactions}</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.transactionDetails.sender}
                        </label>
                        <p className="text-sm font-mono text-gray-800">
                          {transaction.sender === userData.mobile ? 'You' : `+91 ${transaction.sender}`}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.transactionDetails.receiver}
                        </label>
                        <p className="text-sm font-mono text-gray-800">
                          {transaction.receiver === userData.mobile ? 'You' : `+91 ${transaction.receiver}`}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.transactionDetails.amount}
                        </label>
                        <p className={`text-sm font-semibold ${
                          transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'received' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.transactionDetails.status}
                        </label>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(transaction.status)}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(transaction.status)}`}>
                            {t.status[transaction.status]}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.transactionDetails.date}
                        </label>
                        <p className="text-sm text-gray-800 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {transaction.date}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t.transactionDetails.time}
                        </label>
                        <p className="text-sm text-gray-800 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {transaction.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;