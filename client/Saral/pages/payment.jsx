import React, { useState } from 'react';
import { ArrowLeft, Send, CreditCard, DollarSign, Shield, Eye, EyeOff, CheckCircle, X, AlertTriangle } from 'lucide-react';

const NewPaymentPage = () => {
  const [formData, setFormData] = useState({
    receiverAadhaar: '',
    amount: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Sample user data (in real app, this would come from context/props)
  const [userData] = useState({
    name: "Ravi Kumar",
    aadhaar: "123456789012",
    mobile: "9876543210",
    balance: 25750.50
  });

  const [currentLanguage] = useState('english');

  const translations = {
    english: {
      title: "New Payment",
      subtitle: "Send money securely",
      bankName: "GramSeva Bank",
      form: {
        receiverAadhaar: "Receiver's Aadhaar Number",
        receiverPlaceholder: "Enter 12-digit Aadhaar number",
        amount: "Amount to Send",
        amountPlaceholder: "Enter amount in ₹",
        password: "Enter Password",
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
        aadhaarRequired: "Receiver's Aadhaar number is required",
        aadhaarInvalid: "Aadhaar number must be 12 digits",
        aadhaarSame: "Cannot send money to your own account",
        amountRequired: "Amount is required",
        amountInvalid: "Please enter a valid amount",
        amountMin: "Minimum amount is ₹1",
        amountMax: "Amount exceeds your balance",
        passwordRequired: "Password is required"
      },
      popup: {
        confirmTitle: "Confirm Payment",
        confirmSubtitle: "Please verify the payment details",
        receiverLabel: "Sending to",
        amountLabel: "Amount",
        feeLabel: "Transaction Fee",
        totalLabel: "Total Amount",
        passwordLabel: "Enter Password to Confirm",
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
        networkError: "Network error. Please check your connection."
      }
    }
  };

  const t = translations[currentLanguage];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.receiverAadhaar) {
      newErrors.receiverAadhaar = t.validation.aadhaarRequired;
    } else if (formData.receiverAadhaar.length !== 12 || !/^\d{12}$/.test(formData.receiverAadhaar)) {
      newErrors.receiverAadhaar = t.validation.aadhaarInvalid;
    } else if (formData.receiverAadhaar === userData.aadhaar) {
      newErrors.receiverAadhaar = t.validation.aadhaarSame;
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
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format amount input
    if (name === 'amount') {
      // Only allow numbers and decimal point
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
    setPaymentError('');
    
    try {
      // Simulate API call
      console.log('Processing payment:', {
        sender: userData.aadhaar,
        receiver: formData.receiverAadhaar,
        amount: formData.amount,
        timestamp: new Date().toISOString()
      });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success (in real app, this would be based on API response)
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setPaymentSuccess(true);
        setShowPasswordPopup(false);
      } else {
        setPaymentError(t.errors.generic);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(t.errors.networkError);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleBackToDashboard = () => {
    console.log('Navigate back to dashboard');
    // In real app, this would use router to navigate
  };

  const handleMakeAnotherPayment = () => {
    setFormData({
      receiverAadhaar: '',
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

  const maskAadhaar = (aadhaar) => {
    return `XXXX XXXX ${aadhaar.slice(-4)}`;
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const fee = 0; // Free transactions
    return amount + fee;
  };

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
              <span className="font-mono text-sm">{maskAadhaar(formData.receiverAadhaar)}</span>
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
            {/* Receiver Aadhaar Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.form.receiverAadhaar} *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="receiverAadhaar"
                  value={formData.receiverAadhaar}
                  onChange={handleInputChange}
                  placeholder={t.form.receiverPlaceholder}
                  maxLength={12}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.receiverAadhaar ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
              </div>
              {errors.receiverAadhaar && <p className="text-red-500 text-sm mt-1">{errors.receiverAadhaar}</p>}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
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
                <span className="font-mono text-sm">{maskAadhaar(formData.receiverAadhaar)}</span>
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