// Тестовый пример для демонстрации URL с orderNumber 019278296
// Этот файл показывает как использовать компонент с нужными параметрами

const testPaymentData = {
  orderNumber: '019278296',
  amount: '2000.00',
  patientData: 'ТОТ ЖЕ',
  patient: 'ТЕСТОВЫЙ ПАЦИЕНТ',
  service: 'ТЕСТОВАЯ УСЛУГА',
  date: new Date().toLocaleDateString('ru-RU')
};

// Пример URL который будет сгенерирован
const exampleUrl = 'https://vodc.ru/ambulat25/partner/save-transaction-sbp?orderNumber=019278296&amount=2000&patientData=%D0%A2%D0%9E%D0%A2%20%D0%96%D0%95&callback=jsonp_1754595652734_93069';

console.log('Тестовые данные для СБП платежа:');
console.log('orderNumber:', testPaymentData.orderNumber);
console.log('amount:', testPaymentData.amount);
console.log('patientData:', testPaymentData.patientData);
console.log('Ожидаемый URL:', exampleUrl);

export { testPaymentData, exampleUrl };