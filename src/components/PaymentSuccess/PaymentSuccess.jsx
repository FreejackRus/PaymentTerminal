import React from 'react';
import styles from './PaymentSuccess.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';
import printIcon from '../../assets/images/print-icon.svg';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';

const PaymentSuccess = ({ paymentData, onPrintReceipt, onNewPayment }) => {
    const { currentLanguage } = useLanguage();
    
    const formatDateTime = (date) => {
        return date.toLocaleString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const defaultPaymentData = {
        purpose: t('paymentSuccess.medicalServices'),
        recipient: t('paymentSuccess.recipient'),
        method: t('paymentSuccess.bankCard'),
        amount: '2000',
        dateTime: new Date(),
        paymentNumber: '019278296'
    };

    const data = { ...defaultPaymentData, ...paymentData };

    return (
        <div className={styles.paymentSuccess}>
            <ProgressBar currentStep={4} />
            
            <div className={styles.successMessage}>
                <h1 className={styles.title}>{t('paymentSuccess.title')}</h1>
                <p className={styles.subtitle}>
                    {t('paymentSuccess.subtitle')}
                </p>
            </div>

            <div className={styles.paymentDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.label}>{t('paymentSuccess.paymentPurpose')}:</span>
                    <span className={styles.value}>{data.purpose}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>{t('paymentSuccess.recipientLabel')}:</span>
                    <span className={styles.value}>{data.recipient}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>{t('paymentSuccess.paymentMethod')}:</span>
                    <span className={styles.value}>{data.method}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>{t('paymentSuccess.amount')}:</span>
                    <span className={styles.value}>{data.amount}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>{t('paymentSuccess.dateTime')}:</span>
                    <span className={styles.value}>{formatDateTime(data.dateTime)}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>{t('paymentSuccess.paymentNumber')}:</span>
                    <span className={styles.value}>{data.paymentNumber}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button 
                    className={styles.printButton}
                    onClick={onPrintReceipt}
                >
                    <img src={printIcon} alt="" className={styles.printIcon} />
                    {t('paymentSuccess.printReceipt')}
                </button>
                <button 
                    className={styles.newPaymentButton}
                    onClick={onNewPayment}
                >
                    {t('paymentSuccess.newPayment')}
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;