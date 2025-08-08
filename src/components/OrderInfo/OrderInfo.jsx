import React from 'react';
import styles from './OrderInfo.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';

const OrderInfo = ({ orderData, onBack, onContinue }) => {
    const handleContinue = () => {
        onContinue();
    };

    return (
        <div className={styles.wrapper}>
            <ProgressBar currentStep={2} />
            
            <div className={styles.content}>
                <h1 className={styles.title}>Информация о заказе</h1>

                <div className={styles.orderInfo}>
                    <div className={styles.orderDetails}>
                        <p><strong>Заказ:</strong> {orderData.orderNumber}</p>
                        <p><strong>Пациент:</strong> {orderData.patient}</p>
                        <div className={styles.services}>
                            <h3>Услуги:</h3>
                            {orderData.services.map((service, index) => (
                                <div key={index} className={styles.serviceItem}>
                                    <span>{service.name}</span>
                                    <span>{service.price} ₽</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.total}>
                            <strong>Итого: {orderData.total} ₽</strong>
                        </div>
                    </div>
                    <button 
                        className={styles.continueButton}
                        onClick={handleContinue}
                    >
                        Продолжить
                    </button>
                </div>

                <div className={styles.actions}>
                    <button 
                        className={styles.backButton}
                        onClick={onBack}
                    >
                        Назад
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderInfo;