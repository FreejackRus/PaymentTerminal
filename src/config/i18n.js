const translations = {
  ru: {
    barcodeScanning: {
      title: "Сканирование штрих-кода",
      subtitle: "Для получения информации о платеже, пожалуйста,\n отсканируйте штрих-код на вашем направлении\nили квитанции",
      instructionText: "Поднесите штрих-код к сканеру, расположенному ниже экрана.\nДержите штрих-код на расстоянии 10-15 см от сканера.",
      manualText: "Если сканирование не удается, вы можете ввести номер вручную:",
      placeholder: "Введите штрих-код",
      searchButton: "Найти",
      backButton: "Назад",
      searching: "Поиск информации о платеже..."
    },
    header: {
      title: "Платежный терминал",
      language: "Язык"
    },
    mainScreen: {
      title: "Выберите способ оплаты",
      sberPay: "СберПэй",
      cardPayment: "Оплата картой",
      cashPayment: "Оплата наличными"
    },
    paymentMethods: {
      title: "Выбор способа оплаты",
      subtitle: "Пожалуйста, выберите предпочтительный способ оплаты",
      card: "Банковская карта",
      cardSubtitle: "Visa, Mastercard, МИР",
      cardDescription: "Оплата банковской картой через терминал",
      sbpPayment: "СБП",
      sbpSubtitle: "Система быстрых платежей",
      sbpDescription: "Оплата через приложение вашего банка по QR-коду",
      sberPay: "СберПэй",
      cash: "Наличные",
      orderNumber: "Номер заказа",
      service: "Услуга",
      totalAmount: "Сумма к оплате",
      warning1: "Выберите способ оплаты, нажав на соответствующий блок.",
      warning2: "После выбора вы будете перенаправлены на экран оплаты выбранным способом."
    },
    paymentInfo: {
      title: "Информация о заказе",
      waitingPayment: "Ожидает оплаты",
      name: "Наименование",
      quantity: "Количество",
      price: "Стоимость",
      total: "Итого к оплате"
    },
    common: {
      next: "Далее",
      back: "Назад",
      confirm: "Подтвердить",
      cancel: "Отмена",
      startPayment: "Начать оплату"
    },
    progressSteps: {
      scanning: "Сканирование",
      paymentInfo: "Информация о платеже",
      payment: "Оплата",
      result: "Результат оплаты"
    },
    cardPayment: {
      title: "Оплата банковской картой",
      instructions: "Вставьте карту в картридер и следуйте инструкциям на экране",
      insertCard: "Вставьте карту",
      startPayment: "Начать оплату",
      processing: "Обработка платежа..."
    },
    sbpPayment: {
      title: "Оплата через Систему Быстрых Платежей (СБП)",
      paymentInfo: "Информация о платеже",
      service: "Услуга",
      orderNumber: "Номер заказа",
      date: "Дата",
      amountToPay: "Сумма к оплате",
      startPayment: "Начать оплату",
      checkingPayment: "Проверка платежа...",
      iframeTitle: "СБП Оплата",
      noPaymentData: "Данные платежа не предоставлены",
      paymentError: "Ошибка при создании платежа"
    },
    paymentSuccess: {
      title: "Платёж успешно проведён",
      subtitle: "Чек будет отправлен на указанную электронную почту",
      paymentPurpose: "Назначение платежа",
      recipientLabel: "Получатель",
      paymentMethod: "Способ оплаты",
      amount: "Сумма",
      dateTime: "Дата и время",
      paymentNumber: "Номер платежа",
      printReceipt: "Распечатать чек",
      newPayment: "Новый платёж",
      medicalServices: "Оплата медицинских услуг",
      recipient: "ВОККДЦ",
      bankCard: "Банковская карта"
    },
    inactivityDialog: {
      title: "Вы ещё здесь?",
      message: "Обнаружена длительная неактивность. Хотите продолжить работу с терминалом?",
      countdown: "Автоматическое завершение через {seconds} сек.",
      continue: "Продолжить",
      cancel: "Завершить"
    }
  },
  en: {
    barcodeScanning: {
      title: "Barcode Scanning",
      subtitle: "To get payment information, please scan the barcode on your referral\nor receipt",
      instructionText: "Bring the barcode to the scanner located below the screen.\nHold the barcode 10-15 cm from the scanner.",
      manualText: "If scanning fails, you can enter the number manually:",
      placeholder: "Enter barcode",
      searchButton: "Search",
      backButton: "Back",
      searching: "Searching for payment information..."
    },
    header: {
      title: "Payment Terminal",
      language: "Language"
    },
    mainScreen: {
      title: "Select payment method",
      sberPay: "SberPay",
      cardPayment: "Card payment",
      cashPayment: "Cash payment"
    },
    paymentMethods: {
      title: "Select payment method",
      subtitle: "Please select your preferred payment method",
      card: "Bank card",
      cardSubtitle: "Visa, Mastercard, MIR",
      cardDescription: "Pay with bank card via terminal",
      sbpPayment: "SBP",
      sbpSubtitle: "Fast Payment System",
      sbpDescription: "Pay via your bank app using QR code",
      sberPay: "SberPay",
      cash: "Cash",
      orderNumber: "Order number",
      service: "Service",
      totalAmount: "Amount to pay",
      warning1: "Select a payment method by tapping the corresponding block.",
      warning2: "After selection you will be redirected to the payment screen with the chosen method."
    },
    paymentInfo: {
      title: "Order information",
      waitingPayment: "Awaiting payment",
      name: "Name",
      quantity: "Quantity",
      price: "Price",
      total: "Total to pay"
    },
    common: {
      next: "Next",
      back: "Back",
      confirm: "Confirm",
      cancel: "Cancel",
      startPayment: "Start Payment"
    },
    progressSteps: {
      scanning: "Scanning",
      paymentInfo: "Payment info",
      payment: "Payment",
      result: "Payment result"
    },
    cardPayment: {
      title: "Pay with bank card",
      instructions: "Insert your card into the card reader and follow the instructions on screen",
      insertCard: "Insert card",
      startPayment: "Start payment",
      processing: "Processing payment..."
    },
    sbpPayment: {
      title: "Pay via Fast Payment System (SBP)",
      paymentInfo: "Payment information",
      service: "Service",
      orderNumber: "Order number",
      date: "Date",
      amountToPay: "Amount to pay",
      startPayment: "Start payment",
      checkingPayment: "Checking payment...",
      iframeTitle: "SBP Payment",
      noPaymentData: "Payment data not provided",
      paymentError: "Error creating payment"
    },
    paymentSuccess: {
      title: "Payment completed successfully",
      subtitle: "Receipt will be sent to the specified email",
      paymentPurpose: "Payment purpose",
      recipientLabel: "Recipient",
      paymentMethod: "Payment method",
      amount: "Amount",
      dateTime: "Date and time",
      paymentNumber: "Payment number",
      printReceipt: "Print receipt",
      newPayment: "New payment",
      medicalServices: "Payment for medical services",
      recipient: "VOKKDTS",
      bankCard: "Bank card"
    },
    inactivityDialog: {
      title: "Are you still here?",
      message: "Long inactivity detected. Do you want to continue using the terminal?",
      countdown: "Auto-close in {seconds} sec.",
      continue: "Continue",
      cancel: "Exit"
    }
  }
}

export const t = (key, lang = 'ru') => {
  const keys = key.split('.');
  let result = translations[lang];
  
  for (const k of keys) {
    if (result && typeof result === 'object') {
      result = result[k];
    } else {
      return key;
    }
  }
  
  return result || key;
};

export const getLanguages = () => [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' }
];

export default translations;