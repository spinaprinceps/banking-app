import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Smartphone, DollarSign, Shield, Eye, EyeOff, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js'

const NewPaymentPage = () => {
  const [formData, setFormData] = useState({
    receiverMobile: '',
    amount: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [authToken, setAuthToken] = useState(null);
  const nav=useNavigate();
  // Sample user data (in real app, this would come from context/props)
  const [userData] = useState({
    name: "Ravi Kumar",
    aadhaar: "123456789012",
    mobile: "9876543210",
    balance: 25750.50
  });

  const [currentLanguage] = useState('english');

  // Get auth token from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    } else {
      console.error('No auth token found. User needs to login.');
      // In real app, redirect to login page
    }
  }, []);

  const translations = {
    english: {
      title: "New Payment",
      subtitle: "Send money securely",
      bankName: "GramSeva Bank",
      form: {
        receiverMobile: "Receiver's Mobile Number",
        receiverPlaceholder: "Enter 10-digit mobile number",
        amount: "Amount to Send",
        amountPlaceholder: "Enter amount in ₹",
        password: "Your Account Password",
        passwordPlaceholder: "Enter your account password"
      },
      buttons: {
        proceedPayment: "Proceed to Pay",
        confirmPayment: "Confirm Payment",
        cancel: "Cancel",
        backToDashboard: "Back to Dashboard",
        makeAnotherPayment: "Make Another Payment"
      },
      validation: {
        mobileRequired: "Receiver's mobile number is required",
        mobileInvalid: "Mobile number must be 10 digits",
        mobileSame: "Cannot send money to your own number",
        amountRequired: "Amount is required",
        amountInvalid: "Please enter a valid amount",
        amountMin: "Minimum amount is ₹1",
        amountMax: "Amount exceeds your balance",
        passwordRequired: "Password is required",
        tokenMissing: "Authentication token missing. Please login again."
      },
      popup: {
        confirmTitle: "Confirm Payment",
        confirmSubtitle: "Please verify the payment details",
        receiverLabel: "Sending to",
        amountLabel: "Amount",
        feeLabel: "Transaction Fee",
        totalLabel: "Total Amount",
        passwordLabel: "Enter Your Password to Confirm",
        securityNote: "Your transaction is secured with bank-grade encryption"
      },
      success: {
        title: "Payment Successful!",
        subtitle: "Your money has been sent successfully",
        transactionId: "Transaction ID",
        amount: "Amount Sent",
        receiver: "Sent to"
      },
      currentBalance: "Current Balance",
      transactionFee: "Free",
      processing: "Processing payment...",
      errors: {
        generic: "Payment failed. Please try again.",
        insufficientBalance: "Insufficient balance",
        invalidCredentials: "Invalid password",
        networkError: "Network error. Please check your connection.",
        unauthorized: "Session expired. Please login again.",
        tokenExpired: "Authentication token expired. Please login again."
      }
    }
  };

  const t = translations[currentLanguage];

  const validateForm = () => {
    const newErrors = {};
    
    // Check for auth token
    if (!authToken) {
      newErrors.token = t.validation.tokenMissing;
    }
    
    if (!formData.receiverMobile) {
      newErrors.receiverMobile = t.validation.mobileRequired;
    } else if (formData.receiverMobile.length !== 10 || !/^\d{10}$/.test(formData.receiverMobile)) {
      newErrors.receiverMobile = t.validation.mobileInvalid;
    } else if (formData.receiverMobile === userData.mobile) {
      newErrors.receiverMobile = t.validation.mobileSame;
    }
    
    if (!formData.amount) {
      newErrors.amount = t.validation.amountRequired;
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = t.validation.amountInvalid;
      } else if (amount < 1) {
        newErrors.amount = t.validation.amountMin;
      } else if (amount > userData.balance) {
        newErrors.amount = t.validation.amountMax;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = t.validation.passwordRequired;
    }
    
    if (!authToken) {
      newErrors.token = t.validation.tokenMissing;
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format mobile input - only numbers
    if (name === 'receiverMobile') {
      const formattedValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    // Format amount input - only numbers and decimal point
    else if (name === 'amount') {
      const formattedValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProceedPayment = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setShowPasswordPopup(true);
  };

  const handleConfirmPayment = async (e) => {
  e.preventDefault();

  if (!validatePassword()) {
    return;
  }

  setPaymentProcessing(true);
  setPaymentError("");

  try {
    // Prepare payment data
    const paymentData = {
      receiverNumber: formData.receiverMobile,
      amount: parseFloat(formData.amount),
      password: formData.password,
    };

    console.log("Sending payment request with token:", authToken);
    console.log("Payment data:", paymentData);

    // Axios request
    const response = await api.post("/auth/payment/transfer", paymentData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // ✅ Axios response
    const result = response.data;

    console.log("Payment successful:", result);
    setPaymentSuccess(true);
    setShowPasswordPopup(false);

    // Clear sensitive data
    setFormData((prev) => ({
      ...prev,
      password: "",
    }));

  } catch (error) {
    console.error("Payment failed:", error);

    if (error.response) {
      const { status, data } = error.response;

      // 🔹 Match backend response
      if (data.message === "Insufficient balance") {
        setPaymentError("Insufficient balance for this transaction.");
      } else if (data.message === "Invalid credentials") {
        setPaymentError("Incorrect password. Please try again.");
      } else if (status === 401) {
        setPaymentError("Unauthorized. Please log in again.");
        localStorage.removeItem("authToken");
        setAuthToken(null);
      } else if (status === 403) {
        setPaymentError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        setAuthToken(null);
      } else {
        setPaymentError(data.message || "Payment failed. Please try again.");
      }
    } else {
      setPaymentError("Network error. Please check your connection.");
    }
  } finally {
    setPaymentProcessing(false);
  }
};

  const handleBackToDashboard = () => {
    console.log('Navigate back to dashboard');
    // In real app, this would use router to navigate
    nav("/userDashboard")
  };

  const handleMakeAnotherPayment = () => {
    setFormData({
      receiverMobile: '',
      amount: '',
      password: ''
    });
    setErrors({});
    setPaymentSuccess(false);
    setPaymentError('');
    setShowPasswordPopup(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatMobile = (mobile) => {
    return `+91 ${mobile}`;
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const fee = 0; // Free transactions
    return amount + fee;
  };

  // Show error if no token
  if (!authToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-600" size={48} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please login to continue with payment
          </p>
          
          <button
            onClick={() => nav("/login")}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.success.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {t.success.subtitle}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.success.transactionId}:</span>
              <span className="font-mono text-sm">TXN{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.success.amount}:</span>
              <span className="font-semibold text-green-600">{formatCurrency(parseFloat(formData.amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.success.receiver}:</span>
              <span className="font-mono text-sm">{formatMobile(formData.receiverMobile)}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleMakeAnotherPayment}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              {t.buttons.makeAnotherPayment}
            </button>
            <button
              onClick={handleBackToDashboard}
              className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {t.buttons.backToDashboard}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToDashboard}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t.bankName}</h1>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-green-700">{t.currentBalance}: </span>
              <span className="font-semibold text-green-800">{formatCurrency(userData.balance)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-white" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {t.title}
            </h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleProceedPayment} className="space-y-6">
            {/* Receiver Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.receiverMobile} *
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  +91
                </div>
                <input
                  type="text"
                  name="receiverMobile"
                  value={formData.receiverMobile}
                  onChange={handleInputChange}
                  placeholder={t.form.receiverPlaceholder}
                  maxLength={10}
                  className={`w-full pl-16 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.receiverMobile ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.receiverMobile && <p className="text-red-500 text-sm mt-1">{errors.receiverMobile}</p>}
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.amount} *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder={t.form.amountPlaceholder}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.amount ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              
              {/* Transaction Fee Info */}
              {formData.amount && !errors.amount && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(formData.amount) || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transaction Fee:</span>
                    <span className="font-medium text-green-600">{t.transactionFee}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-green-200 mt-2 pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Global Error Messages */}
            {errors.token && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="text-red-500" size={20} />
                <p className="text-red-600 text-sm">{errors.token}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!authToken}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.buttons.proceedPayment}
            </button>
          </form>
        </div>
      </div>

      {/* Password Confirmation Popup */}
      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowPasswordPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              disabled={paymentProcessing}
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {t.popup.confirmTitle}
              </h2>
              <p className="text-gray-600">{t.popup.confirmSubtitle}</p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.popup.receiverLabel}:</span>
                <span className="font-mono text-sm">{formatMobile(formData.receiverMobile)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.popup.amountLabel}:</span>
                <span className="font-semibold">{formatCurrency(parseFloat(formData.amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.popup.feeLabel}:</span>
                <span className="font-semibold text-green-600">{t.transactionFee}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                <span>{t.popup.totalLabel}:</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            {/* Password Input */}
            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.popup.passwordLabel} *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.form.passwordPlaceholder}
                    disabled={paymentProcessing}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    } ${paymentProcessing ? 'opacity-50' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={paymentProcessing}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Error Message */}
              {paymentError && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="text-red-500" size={20} />
                  <p className="text-red-600 text-sm">{paymentError}</p>
                </div>
              )}

              {/* Security Note */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-700 text-xs flex items-center">
                  <Shield className="mr-2" size={16} />
                  {t.popup.securityNote}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordPopup(false)}
                  disabled={paymentProcessing}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  {t.buttons.cancel}
                </button>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 flex items-center justify-center"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t.processing}
                    </>
                  ) : (
                    t.buttons.confirmPayment
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPaymentPage;