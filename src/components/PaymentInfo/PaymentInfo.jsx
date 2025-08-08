import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';
import styles from './PaymentInfo.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';

const PaymentInfo = ({ paymentData, onBack, onContinue }) => {
    const { currentLanguage } = useLanguage();
    const services = paymentData?.services || [];
    const total = paymentData?.total || 0;
    const formatPrice = (price) => {
        return `${price.toLocaleString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US')} ₽`;
    };

    return (
        <div className={styles.wrapper}>
            <ProgressBar currentStep={2} />
            <div className={styles.paymentInfo}>
            <div className={styles.header}>
                <h2 className={styles.title}>{t('paymentInfo.title', currentLanguage)}</h2>
                <div className={styles.status}>
                    <span className={styles.statusText}>{t('paymentInfo.waitingPayment', currentLanguage)}</span>
                </div>
            </div>

            <div className={styles.servicesTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.nameColumn}>{t('paymentInfo.name', currentLanguage)}</div>
                    <div className={styles.quantityColumn}>{t('paymentInfo.quantity', currentLanguage)}</div>
                    <div className={styles.priceColumn}>{t('paymentInfo.price', currentLanguage)}</div>
                </div>
                
                <div className={styles.tableBody}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.tableRow}>
                            <div className={styles.nameColumn}>{service.name}</div>
                            <div className={styles.quantityColumn}>{service.quantity}</div>
                            <div className={styles.priceColumn}>{formatPrice(service.price)}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.tableFooter}>
                    <div className={styles.totalLabel}>{t('paymentInfo.total', currentLanguage)}</div>
                    <div className={styles.totalAmount}>{formatPrice(total)}</div>
                </div>
            </div>

            <div className={styles.actions}>
                <button 
                    className={styles.backButton}
                    onClick={onBack}
                >
                    {t('common.back', currentLanguage)}
                </button>
                <button 
                    className={styles.payButton}
                    onClick={onContinue}
                >
                    {t('common.next', currentLanguage)}
                </button>
            </div>
            </div>
        </div>
    );
};

export default PaymentInfo;