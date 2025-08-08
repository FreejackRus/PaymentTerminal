const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Сканер штрих-кодов
  onBarcodeScanned: (callback) => ipcRenderer.on('barcode-scanned', callback),
  
  // Принтер
  printReceipt: (data) => ipcRenderer.invoke('print-receipt', data),
  
  // Платежный терминал
  processPayment: (amount) => ipcRenderer.invoke('process-payment', amount),
  onPaymentStatus: (callback) => ipcRenderer.on('payment-status', callback)
});