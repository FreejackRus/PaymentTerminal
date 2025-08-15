/**
 * Единый модуль для работы с заказами
 * Включает функции получения описания заказа, статуса заказа и регистрации заказа на оплату
 */
class OrderManager {
    constructor() {
        this.baseUrls = {
            description: '/api/ambulat25/partner/get-order-description',
            status: '/api/ambulat25/partner/status',
            registration: '/api/ambulat25/partner/register-order'
        };
    }

    // ==================== ПОЛУЧЕНИЕ ОПИСАНИЯ ЗАКАЗА ====================

    /**
     * Получить описание заказа по ID
     * @param {string} orderId - ID заказа
     * @returns {Promise<Object>} Описание заказа
     */
    async getOrderDescription(orderId) {
        try {
            const response = await fetch(`${this.baseUrls.description}?id=${encodeURIComponent(orderId)}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === false) {
                throw new Error(data.data || 'Заказ не найден');
            }

            return data.data;
        } catch (error) {
            console.error('Ошибка при получении описания заказа:', error);
            throw error;
        }
    }

    /**
     * Форматировать данные заказа для отображения
     * @param {Array} orderData - Данные заказа
     * @returns {Object} Отформатированные данные
     */
    formatOrderData(orderData) {
        if (!Array.isArray(orderData)) {
            return null;
        }

        return orderData.map(item => ({
            service: item.service || '',
            dateTime: this.formatDateTime(item.dateTime),
            cabinet: item.cabinet || '',
            doctor: item.doctor || '',
            price: this.formatPrice(item.price),
            status: item.status || '',
            description: item.description || ''
        }));
    }

    // ==================== ПОЛУЧЕНИЕ СТАТУСА ЗАКАЗА ====================

    /**
     * Получить статус заказа по ID
     * @param {string} orderId - ID заказа в системе Сбербанка
     * @returns {Promise<Object>} Статус заказа
     */
    async getOrderStatus(orderId) {
        try {
            const response = await fetch(`${this.baseUrls.status}/${encodeURIComponent(orderId)}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/html',
                    'Accept': 'text/html'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            return html;
        } catch (error) {
            console.error('Ошибка при получении статуса заказа:', error);
            throw error;
        }
    }

    /**
     * Получить статус заказа через callback (для JSONP)
     * @param {string} orderId - ID заказа
     * @param {string} callback - Имя callback функции
     * @returns {Promise<Object>} Статус заказа
     */
    async getOrderStatusCallback(orderId, callback = 'callback') {
        try {
            const response = await fetch(`${this.baseUrls.status}?orderId=${encodeURIComponent(orderId)}&callback=${callback}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/javascript'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            return data;
        } catch (error) {
            console.error('Ошибка при получении статуса заказа через callback:', error);
            throw error;
        }
    }

    /**
     * Проверить статус оплаты заказа
     * @param {string} orderId - ID заказа
     * @returns {Promise<Object>} Результат проверки
     */
    async checkPaymentStatus(orderId) {
        try {
            const response = await fetch(`/callback/${encodeURIComponent(orderId)}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при проверке статуса оплаты:', error);
            throw error;
        }
    }

    // ==================== РЕГИСТРАЦИЯ ЗАКАЗА НА ОПЛАТУ ====================

    /**
     * Зарегистрировать заказ на оплату
     * @param {Object} orderData - Данные заказа
     * @param {string} orderData.orderNumber - Номер заказа
     * @param {number} orderData.amount - Сумма заказа в копейках
     * @param {string} orderData.returnUrl - URL для возврата после оплаты
     * @param {string} [orderData.data] - Дополнительные данные
     * @param {string} [orderData.description] - Описание заказа
     * @param {string} [orderData.patientData] - Данные пациента
     * @param {string} [orderData.callback] - Callback функция для JSONP
     * @returns {Promise<Object>} Результат регистрации
     */
    async registerOrder(orderData) {
        try {
            this.validateOrderData(orderData);

            const params = new URLSearchParams();
            params.append('orderNumber', orderData.orderNumber);
            params.append('amount', orderData.amount.toString());
            params.append('returnUrl', orderData.returnUrl);
            
            if (orderData.data) {
                params.append('data', orderData.data);
            }
            if (orderData.description) {
                params.append('description', orderData.description);
            }
            if (orderData.patientData) {
                params.append('patientData', orderData.patientData);
            }
            if (orderData.callback) {
                params.append('callback', orderData.callback);
            }

            const response = await fetch(this.baseUrls.registration, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: params
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.processRegistrationResponse(data);
        } catch (error) {
            console.error('Ошибка при регистрации заказа:', error);
            throw error;
        }
    }

    /**
     * Валидация данных заказа
     * @param {Object} orderData - Данные заказа
     * @throws {Error} Ошибка валидации
     */
    validateOrderData(orderData) {
        if (!orderData) {
            throw new Error('Данные заказа не предоставлены');
        }

        if (!orderData.orderNumber || typeof orderData.orderNumber !== 'string') {
            throw new Error('Номер заказа обязателен и должен быть строкой');
        }

        if (!orderData.amount || typeof orderData.amount !== 'number' || orderData.amount <= 0) {
            throw new Error('Сумма заказа обязательна и должна быть положительным числом');
        }

        if (!orderData.returnUrl || typeof orderData.returnUrl !== 'string') {
            throw new Error('URL возврата обязателен и должен быть строкой');
        }

        // Проверка валидности URL
        try {
            new URL(orderData.returnUrl);
        } catch {
            throw new Error('URL возврата должен быть валидным URL');
        }
    }

    /**
     * Обработка ответа регистрации
     * @param {Object} response - Ответ сервера
     * @returns {Object} Обработанный ответ
     */
    processRegistrationResponse(response) {
        const result = {
            success: false,
            orderId: null,
            formUrl: null,
            errorCode: null,
            errorMessage: null,
            orderNumber: null,
            amount: null
        };

        if (response.errorCode === 0) {
            result.success = true;
            result.orderId = response.orderId;
            result.formUrl = response.formUrl;
            result.orderNumber = response.orderNumber;
            result.amount = response.amount;
        } else {
            result.errorCode = response.errorCode;
            result.errorMessage = this.getErrorMessage(response.errorCode);
        }

        return result;
    }

    // ==================== УТИЛИТЫ ====================

    /**
     * Форматировать дату и время
     * @param {string} dateTime - Дата и время
     * @returns {string} Отформатированная дата
     */
    formatDateTime(dateTime) {
        if (!dateTime) return '';
        
        try {
            const date = new Date(dateTime);
            return date.toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateTime;
        }
    }

    /**
     * Форматировать цену
     * @param {number|string} price - Цена
     * @returns {string} Отформатированная цена
     */
    formatPrice(price) {
        if (!price) return '0 ₽';
        
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return price;
        
        return `${numPrice.toLocaleString('ru-RU')} ₽`;
    }

    /**
     * Получить текстовое описание статуса
     * @param {number} statusCode - Код статуса
     * @returns {string} Описание статуса
     */
    getStatusText(statusCode) {
        const statusMap = {
            0: 'Заказ зарегистрирован, но не оплачен',
            1: 'Предавторизованная сумма захолдирована',
            2: 'Проведена полная авторизация суммы заказа',
            3: 'Авторизация отменена',
            4: 'По транзакции была проведена операция возврата',
            5: 'Инициирована авторизация через ACS банка-эмитента',
            6: 'Авторизация отклонена'
        };

        return statusMap[statusCode] || 'Неизвестный статус';
    }

    /**
     * Получить сообщение об ошибке по коду
     * @param {number} errorCode - Код ошибки
     * @returns {string} Сообщение об ошибке
     */
    getErrorMessage(errorCode) {
        const errorMessages = {
            0: 'Обработка запроса прошла без системных ошибок',
            1: 'Заказ с таким номером уже зарегистрирован в системе',
            2: 'Неизвестная валюта',
            3: 'Отсутствует номер заказа',
            4: 'Отсутствует сумма заказа',
            5: 'Недопустимое значение суммы заказа',
            6: 'Незарегистрированный мерчант',
            7: 'Заказ не найден',
            8: 'Системная ошибка'
        };

        return errorMessages[errorCode] || `Неизвестная ошибка (код: ${errorCode})`;
    }

    /**
     * Получить текстовое описание ошибки
     * @param {number} errorCode - Код ошибки
     * @returns {string} Описание ошибки
     */
    getErrorText(errorCode) {
        const errorMap = {
            0: 'Обработка запроса прошла без системных ошибок',
            1: 'Заказ с таким номером уже зарегистрирован в системе',
            2: 'Неизвестная валюта',
            3: 'Отсутствует номер заказа',
            4: 'Отсутствует сумма заказа',
            5: 'Недопустимое значение суммы заказа',
            6: 'Незарегистрированный мерчант',
            7: 'Заказ не найден'
        };

        return errorMap[errorCode] || 'Неизвестная ошибка';
    }

    /**
     * Проверить успешность операции
     * @param {number} errorCode - Код ошибки
     * @param {number} statusCode - Код статуса
     * @returns {boolean} Успешность операции
     */
    isPaymentSuccessful(errorCode, statusCode) {
        return errorCode === 0 && statusCode === 2;
    }

    /**
     * Конвертировать рубли в копейки
     * @param {number} rubles - Сумма в рублях
     * @returns {number} Сумма в копейках
     */
    rublesToKopecks(rubles) {
        return Math.round(rubles * 100);
    }

    /**
     * Конвертировать копейки в рубли
     * @param {number} kopecks - Сумма в копейках
     * @returns {number} Сумма в рублях
     */
    kopecksToRubles(kopecks) {
        return kopecks / 100;
    }

    /**
     * Создать URL для перенаправления на форму оплаты
     * @param {string} formUrl - URL формы оплаты
     * @param {Object} additionalParams - Дополнительные параметры
     * @returns {string} Полный URL для перенаправления
     */
    createPaymentUrl(formUrl, additionalParams = {}) {
        if (!formUrl) {
            throw new Error('URL формы оплаты не предоставлен');
        }

        const url = new URL(formUrl);
        
        Object.entries(additionalParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.append(key, value.toString());
            }
        });

        return url.toString();
    }

    /**
     * Перенаправить на форму оплаты
     * @param {string} formUrl - URL формы оплаты
     * @param {Object} additionalParams - Дополнительные параметры
     */
    redirectToPayment(formUrl, additionalParams = {}) {
        const paymentUrl = this.createPaymentUrl(formUrl, additionalParams);
        window.location.href = paymentUrl;
    }
}

export default OrderManager;