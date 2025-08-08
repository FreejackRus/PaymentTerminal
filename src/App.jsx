import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header/Header';
import MainScreen from './components/MainScreen/MainScreen';
import BarcodeScanning from './components/BarcodeScanning/BarcodeScanning';
import PaymentInfo from './components/PaymentInfo/PaymentInfo';
import PaymentMethodSelection from './components/PaymentMethodSelection/PaymentMethodSelection';
import CardPayment from './components/CardPayment/CardPayment';
import SBPPayment from './components/SBPPayment/SBPPayment';
import PaymentSuccess from './components/PaymentSuccess/PaymentSuccess';

const SCREENS = {
  MAIN: 'main',
  SCANNING: 'scanning',
  PAYMENT_INFO: 'payment_info',
  PAYMENT_METHOD: 'payment_method',
  CARD_PAYMENT: 'card_payment',
  SBP_PAYMENT: 'sbp_payment',
  PAYMENT_SUCCESS: 'payment_success'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MAIN);
  const [paymentData, setPaymentData] = useState(null);

  return (
    <LanguageProvider>
      <div className="App">
        <Header />
        {currentScreen === SCREENS.MAIN && (
          <MainScreen 
            onStartPayment={() => setCurrentScreen(SCREENS.SCANNING)}
          />
        )}
        
        {currentScreen === SCREENS.SCANNING && (
          <BarcodeScanning 
            onBack={() => setCurrentScreen(SCREENS.MAIN)}
            onOrderFound={(data) => {
              setPaymentData(data);
              setCurrentScreen(SCREENS.PAYMENT_INFO);
            }}
          />
        )}

        {currentScreen === SCREENS.PAYMENT_INFO && (
          <PaymentInfo
            paymentData={paymentData}
            onBack={() => setCurrentScreen(SCREENS.SCANNING)}
            onContinue={() => setCurrentScreen(SCREENS.PAYMENT_METHOD)}
          />
        )}

        {currentScreen === SCREENS.PAYMENT_METHOD && (
          <PaymentMethodSelection
            paymentData={paymentData}
            onBack={() => setCurrentScreen(SCREENS.PAYMENT_INFO)}
            onCardPayment={() => setCurrentScreen(SCREENS.CARD_PAYMENT)}
            onSBPPayment={() => setCurrentScreen(SCREENS.SBP_PAYMENT)}
          />
        )}

        {currentScreen === SCREENS.CARD_PAYMENT && (
          <CardPayment
            paymentData={paymentData}
            onBack={() => setCurrentScreen(SCREENS.PAYMENT_METHOD)}
            onPaymentComplete={() => setCurrentScreen(SCREENS.PAYMENT_SUCCESS)}
          />
        )}

        {currentScreen === SCREENS.SBP_PAYMENT && (
          <SBPPayment
            paymentData={paymentData}
            onBack={() => setCurrentScreen(SCREENS.PAYMENT_METHOD)}
            onPaymentComplete={() => setCurrentScreen(SCREENS.PAYMENT_SUCCESS)}
          />
        )}

        {currentScreen === SCREENS.PAYMENT_SUCCESS && (
          <PaymentSuccess
            paymentData={paymentData}
            onNewPayment={() => setCurrentScreen(SCREENS.MAIN)}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;