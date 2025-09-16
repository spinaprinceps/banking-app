import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Shield, Smartphone, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [showLanguagePopup, setShowLanguagePopup] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const nav=useNavigate();

  const languages = {
    english: {
      bankName: "GramSeva Bank",
      tagline: "Banking Made Simple for Rural India",
      hero: {
        title: "Empowering Rural Communities",
        subtitle: "Simple, Secure, and Accessible Banking Solutions",
        description: "Join thousands of rural families who trust GramSeva Bank for their financial needs. Banking made easy in your language."
      },
      buttons: {
        login: "Login",
        signup: "Sign Up",
        getStarted: "Get Started Today"
      },
      features: {
        title: "Why Choose GramSeva Bank?",
        items: [
          {
            icon: Users,
            title: "Community First",
            description: "Built specifically for rural communities with local language support"
          },
          {
            icon: Shield,
            title: "Secure & Trusted",
            description: "Bank-grade security with Aadhaar integration for safe transactions"
          },
          {
            icon: Smartphone,
            title: "Mobile Friendly",
            description: "Works perfectly on any device - smartphone, tablet, or computer"
          },
          {
            icon: MapPin,
            title: "Local Support",
            description: "Dedicated support in your regional language from local experts"
          }
        ]
      },
      languagePopup: {
        title: "Choose Your Language",
        subtitle: "Select your preferred language to continue"
      }
    },
    hindi: {
      bankName: "ग्रामसेवा बैंक",
      tagline: "ग्रामीण भारत के लिए सरल बैंकिंग",
      hero: {
        title: "ग्रामीण समुदायों को सशक्त बनाना",
        subtitle: "सरल, सुरक्षित और सुलभ बैंकिंग समाधान",
        description: "हजारों ग्रामीण परिवारों के साथ जुड़ें जो अपनी वित्तीय आवश्यकताओं के लिए ग्रामसेवा बैंक पर भरोसा करते हैं।"
      },
      buttons: {
        login: "लॉगिन",
        signup: "साइन अप",
        getStarted: "आज ही शुरू करें"
      },
      features: {
        title: "ग्रामसेवा बैंक क्यों चुनें?",
        items: [
          {
            icon: Users,
            title: "समुदाय पहले",
            description: "स्थानीय भाषा समर्थन के साथ विशेष रूप से ग्रामीण समुदायों के लिए बनाया गया"
          },
          {
            icon: Shield,
            title: "सुरक्षित और भरोसेमंद",
            description: "सुरक्षित लेनदेन के लिए आधार एकीकरण के साथ बैंक-ग्रेड सुरक्षा"
          },
          {
            icon: Smartphone,
            title: "मोबाइल फ्रेंडली",
            description: "किसी भी डिवाइस पर बेहतर काम करता है - स्मार्टफोन, टैबलेट या कंप्यूटर"
          },
          {
            icon: MapPin,
            title: "स्थानीय सहायता",
            description: "स्थानीय विशेषज्ञों से आपकी क्षेत्रीय भाषा में समर्पित सहायता"
          }
        ]
      },
      languagePopup: {
        title: "अपनी भाषा चुनें",
        subtitle: "जारी रखने के लिए अपनी पसंदीदा भाषा का चयन करें"
      }
    },
    kannada: {
      bankName: "ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್",
      tagline: "ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕೆ ಸರಳ ಬ್ಯಾಂಕಿಂಗ್",
      hero: {
        title: "ಗ್ರಾಮೀಣ ಸಮುದಾಯಗಳನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು",
        subtitle: "ಸರಳ, ಸುರಕ್ಷಿತ ಮತ್ತು ಪ್ರವೇಶಿಸಬಹುದಾದ ಬ್ಯಾಂಕಿಂಗ್ ಪರಿಹಾರಗಳು",
        description: "ತಮ್ಮ ಆರ್ಥಿಕ ಅಗತ್ಯಗಳಿಗಾಗಿ ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್ ಅನ್ನು ನಂಬುವ ಸಾವಿರಾರು ಗ್ರಾಮೀಣ ಕುಟುಂಬಗಳೊಂದಿಗೆ ಸೇರಿಕೊಳ್ಳಿ।"
      },
      buttons: {
        login: "ಲಾಗಿನ್",
        signup: "ಸೈನ್ ಅಪ್",
        getStarted: "ಇಂದೇ ಪ್ರಾರಂಭಿಸಿ"
      },
      features: {
        title: "ಗ್ರಾಮಸೇವಾ ಬ್ಯಾಂಕ್ ಅನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಬೇಕು?",
        items: [
          {
            icon: Users,
            title: "ಸಮುದಾಯ ಮೊದಲು",
            description: "ಸ್ಥಳೀಯ ಭಾಷಾ ಬೆಂಬಲದೊಂದಿಗೆ ವಿಶೇಷವಾಗಿ ಗ್ರಾಮೀಣ ಸಮುದಾಯಗಳಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ"
          },
          {
            icon: Shield,
            title: "ಸುರಕ್ಷಿತ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ",
            description: "ಸುರಕ್ಷಿತ ವಹಿವಾಟುಗಳಿಗಾಗಿ ಆಧಾರ್ ಏಕೀಕರಣದೊಂದಿಗೆ ಬ್ಯಾಂಕ್-ದರ್ಜೆಯ ಸುರಕ್ಷತೆ"
          },
          {
            icon: Smartphone,
            title: "ಮೊಬೈಲ್ ಫ್ರೆಂಡ್ಲಿ",
            description: "ಯಾವುದೇ ಸಾಧನದಲ್ಲಿ ಪರಿಪೂರ್ಣವಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತದೆ - ಸ್ಮಾರ್ಟ್‌ಫೋನ್, ಟ್ಯಾಬ್ಲೆಟ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್"
          },
          {
            icon: MapPin,
            title: "ಸ್ಥಳೀಯ ಬೆಂಬಲ",
            description: "ಸ್ಥಳೀಯ ತಜ್ಞರಿಂದ ನಿಮ್ಮ ಪ್ರಾದೇಶಿಕ ಭಾಷೆಯಲ್ಲಿ ಮೀಸಲಾದ ಬೆಂಬಲ"
          }
        ]
      },
      languagePopup: {
        title: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        subtitle: "ಮುಂದುವರೆಯಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
      }
    }
  };

  const currentLang = languages[selectedLanguage];

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setShowLanguagePopup(false);
    // Here you would call your backend API to set the language preference
    localStorage.setItem("appLanguage",lang)
    console.log('Language changed to:', lang);
  };

  const navigateToLogin = () => {
    // Navigation logic to login page
    nav("/login")
    console.log('Navigate to login page');
  };

  const navigateToSignup = () => {
    // Navigation logic to signup page
    nav("/signup")
    console.log('Navigate to signup page');
  };

  useEffect(()=>{
     const savedLang = localStorage.getItem("appLanguage");
    if (savedLang) {
      setSelectedLanguage(savedLang);
      setShowLanguagePopup(false);
    } else {
      setShowLanguagePopup(true);
    }
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Language Selection Popup */}
      {showLanguagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowLanguagePopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentLang.languagePopup.title}
              </h2>
              <p className="text-gray-600">
                {currentLang.languagePopup.subtitle}
              </p>
            </div>
            <div className="space-y-3">
              {Object.keys(languages).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedLanguage === lang
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className="font-semibold">
                    {lang === 'english' && 'English'}
                    {lang === 'hindi' && 'हिंदी'}
                    {lang === 'kannada' && 'ಕನ್ನಡ'}
                  </div>
                  <div className="text-sm opacity-75">
                    {languages[lang].bankName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  {currentLang.bankName}
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  {currentLang.tagline}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={() => setShowLanguagePopup(true)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm">
                  {selectedLanguage === 'english' && 'EN'}
                  {selectedLanguage === 'hindi' && 'हि'}
                  {selectedLanguage === 'kannada' && 'ಕನ್'}
                </span>
                <ChevronDown size={16} />
              </button>
              
              <button
                onClick={navigateToLogin}
                className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                {currentLang.buttons.login}
              </button>
              
              <button
                onClick={navigateToSignup}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {currentLang.buttons.signup}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {currentLang.hero.title}
            </h2>
            <h3 className="text-xl md:text-2xl text-green-600 mb-4 font-semibold">
              {currentLang.hero.subtitle}
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {currentLang.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={navigateToSignup}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg"
              >
                {currentLang.buttons.getStarted}
              </button>
              <button
                onClick={navigateToLogin}
                className="px-8 py-4 border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold text-lg"
              >
                {currentLang.buttons.login}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full">
              <div className="bg-gradient-to-br from-green-100 to-blue-100 p-8 rounded-2xl text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Smartphone className="text-white" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Mobile Banking
                </h3>
                <p className="text-gray-600">
                  Access your account anytime, anywhere with our secure mobile platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
            {currentLang.features.title}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentLang.features.items.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="text-xl font-bold">{currentLang.bankName}</span>
          </div>
          <p className="text-gray-400">
            © 2024 {currentLang.bankName}. All rights reserved. | Made for Rural India with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;