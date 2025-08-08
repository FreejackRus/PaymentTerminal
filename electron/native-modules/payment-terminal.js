// const { ipcMain } = require('electron');
// const { KozhenP10 } = require('kozhen-p10-sdk');
//
// module.exports = {
//   init: () => {
//     const terminal = new KozhenP10('/dev/ttyUSB0');
//
//     ipcMain.handle('process-payment', async (event, amount) => {
//       try {
//         const result = await terminal.processPayment(amount);
//         return { success: true, transactionId: result.transactionId };
//       } catch (error) {
//         return { success: false, error: error.message };
//       }
//     });
//
//     terminal.on('status', (status) => {
//       ipcMain.emit('payment-status', status);
//     });
//   }
// };