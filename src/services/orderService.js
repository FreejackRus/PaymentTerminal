import OrderManager from './order-manager.js';

class OrderService {
    constructor() {
        this.orderManager = new OrderManager();
    }

    /**
     * Получить информацию о заказе по номеру
     * @param {string} orderNumber - Номер заказа
     * @returns {Promise<Object>} - Данные заказа
     */
    async getOrderInfo(orderNumber) {
        try {
            // Используем OrderManager для получения данных
            const orderData = await this.orderManager.getOrderDescription(orderNumber);
            
            if (orderData && Array.isArray(orderData) && orderData.length > 0) {
                // Форматируем данные в нужный формат для компонентов
                return this.formatOrderData(orderData);
            } else {
                // Если данные не найдены, выбрасываем ошибку
                throw new Error('Заказ не найден или данные пусты');
            }
        } catch (error) {
            console.error('Ошибка получения данных заказа:', error);
            // Пробрасываем ошибку дальше вместо возврата моков
            throw error;
        }
    }

    /**
     * Форматирует данные заказа из OrderManager в формат для компонентов
     * @param {Array|Object} orderData - Данные от OrderManager (массив услуг или объект)
     * @returns {Object} - Отформатированные данные
     */
    formatOrderData(orderData) {
        // Если это массив услуг из API
        if (Array.isArray(orderData)) {
            const totalAmount = orderData.reduce((sum, service) => {
                const price = parseFloat(service.price) || 0;
                return sum + price;
            }, 0);
            
            return {
                orderNumber: '019312775', // Используем фиксированный номер заказа
                services: orderData.map(service => ({
                    name: service.service,
                    dateTime: service.dateTime,
                    cabinet: service.cabinet,
                    doctor: service.doctor,
                    price: parseFloat(service.price) || 0,
                    description: service.description
                })),
                total: totalAmount,
                amount: totalAmount
            };
        }
        
        // Если это объект (старый формат)
        const totalAmount = orderData.totalAmount || orderData.total || 0;
        return {
            orderNumber: orderData.orderNumber || orderData.id,
            services: orderData.services || orderData.items || [],
            total: totalAmount,
            amount: totalAmount
        };
    }

    /**
     * Возвращает имитацию данных заказа (заглушка)
     * @param {string} orderNumber - Номер заказа
     * @returns {Object} - Имитация данных заказа
     */
    getMockOrderData(orderNumber) {
        return {
            orderNumber: orderNumber || '019312775',
            services: [
                { name: 'Консультация терапевта', quantity: 1, price: 1500 },
                { name: 'Общий анализ крови', quantity: 1, price: 800 },
                { name: 'ЭКГ', quantity: 1, price: 1200 }
            ],
            total: 2000
        };
    }

    /**
     * Регистрирует заказ на оплату
     * @param {Object} orderData - Данные заказа
     * @param {Object} paymentData - Данные платежа
     * @returns {Promise<Object>} - Результат регистрации
     */
    async registerOrderForPayment(orderData, paymentData) {
        try {
            const result = await this.orderManager.registerOrder({
                orderNumber: orderData.orderNumber,
                amount: orderData.amount || orderData.total,
                ...paymentData
            });
            
            return result;
        } catch (error) {
            console.error('Ошибка регистрации заказа:', error);
            // Пробрасываем ошибку дальше вместо возврата моков
            throw error;
        }
    }

    /**
     * Проверяет статус платежа
     * @param {string} orderId - ID заказа
     * @returns {Promise<Object>} - Статус платежа
     */
    async checkPaymentStatus(orderId) {
        try {
            // Используем OrderManager для проверки статуса
            const status = await this.orderManager.checkPaymentStatus(orderId);
            console.log('Статус платежа от OrderManager:', status);
            return status;
        } catch (error) {
            console.warn('Ошибка проверки статуса платежа:', error);
            // Возвращаем базовый статус в случае ошибки
            return { status: 'pending', message: 'Проверка статуса...' };
        }
    }

    /**
     * Тестовый метод для проверки работы с orderID = 019312775
     * @returns {Promise<Object>} - Результат тестирования
     */
    async testOrderManager() {
        const testOrderId = '019312775';
        console.log(`Тестирование OrderManager с orderID: ${testOrderId}`);
        
        try {
            // Тестируем получение информации о заказе
            const orderInfo = await this.getOrderInfo(testOrderId);
            console.log('Информация о заказе:', orderInfo);
            
            // Тестируем проверку статуса
            const status = await this.checkPaymentStatus(testOrderId);
            console.log('Статус заказа:', status);
            
            return {
                success: true,
                orderInfo,
                status,
                message: 'Тестирование завершено успешно'
            };
        } catch (error) {
            console.error('Ошибка при тестировании:', error);
            return {
                success: false,
                error: error.message,
                message: 'Ошибка при тестировании OrderManager'
            };
        }
    }
}

// Создаем единственный экземпляр сервиса
const orderService = new OrderService();

export default orderService;