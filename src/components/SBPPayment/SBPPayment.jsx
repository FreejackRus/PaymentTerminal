import React, { useState, useEffect } from 'react';
import styles from './SBPPayment.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';
import { saveTransactionSBP, checkTransactionSBP } from '../../api/payment';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';

const SBPPayment = ({ paymentData, onBack, onPaymentComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [sbpFormUrl, setSbpFormUrl] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const { currentLanguage } = useLanguage();





    useEffect(() => {
        let checkInterval;
        let progressInterval;
        
        if (transactionId && isProcessing && !sbpFormUrl) {
            // Progress simulation
            progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 1000);
            
            checkInterval = setInterval(async () => {
                try {
                    const result = await checkTransactionSBP(transactionId);
                    if (result.success) {
                        if (result.completed) {
                            setPaymentStatus('success');
                            setIsProcessing(false);
                            setProgress(100);
                            setTimeout(() => {
                                onPaymentComplete();
                            }, 2000);
                            clearInterval(checkInterval);
                            clearInterval(progressInterval);
                        } else if (result.text) {
                            setPaymentStatus(result.text);
                        }
                    } else {
                        setError(result.error);
                        setIsProcessing(false);
                        clearInterval(checkInterval);
                        clearInterval(progressInterval);
                    }
                } catch (error) {
                    console.error('Error checking transaction:', error);
                }
            }, 5000);
        }
        return () => {
            clearInterval(checkInterval);
            clearInterval(progressInterval);
        };
    }, [transactionId, isProcessing, sbpFormUrl, onPaymentComplete]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartPayment = async () => {
        if (!paymentData) {
            setError(t('sbpPayment.noPaymentData', currentLanguage));
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const patientData = `${paymentData?.patientLastname || ''};${paymentData?.patientFirstname || ''};${paymentData?.patientMiddlename || ''};${paymentData?.patientBirthDate || ''};;`;
            
            const amount = paymentData?.amount || '2000';
            const cleanAmount = amount.toString().replace(/[^\d.]/g, '');
            
            const result = await saveTransactionSBP(
                paymentData?.orderNumber || '000000', 
                cleanAmount, 
                patientData
            );

            if (result.success) {
                setTransactionId(result.transactionID);
                setSbpFormUrl(result.formUrl);
                setIsProcessing(false); // Stop processing to show iframe
            } else {
                setError(result.error);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Error starting SBP payment:', error);
            setError(t('sbpPayment.paymentError', currentLanguage));
            setIsProcessing(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <ProgressBar currentStep={3} />
            
            <div className={styles.content}>
                <h1 className={styles.title}>{t('sbpPayment.title', currentLanguage)}</h1>
                
                {!isProcessing ? (
                    <>
                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}
                        
                        {paymentStatus && (
                            <div className={styles.statusMessage}>
                                {paymentStatus}
                            </div>
                        )}

                        {sbpFormUrl ? (
                            <div className={styles.paymentFormFull}>
                                <div className={styles.sbpFormContainerFull}>
                                    <iframe
                                        src={sbpFormUrl}
                                        className={styles.sbpIframeFull}
                                        frameBorder="0"
                                        title={t('sbpPayment.iframeTitle', currentLanguage)}
                                        scrolling="no"
                                    />
                                </div>
                                
                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className={styles.cancelButton}
                                    >
                                        {t('common.cancel', currentLanguage)}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles.paymentInfo}>
                                    <h3 className={styles.infoTitle}>{t('sbpPayment.paymentInfo', currentLanguage)}</h3>
                                    <div className={styles.infoItem}>
                                        <span>{t('sbpPayment.patient', currentLanguage)}: {paymentData?.patient || `${paymentData?.patientLastname || ''} ${paymentData?.patientFirstname || ''} ${paymentData?.patientMiddlename || ''}`.trim() || 'Иванов Иван Иванович'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span>{t('sbpPayment.service', currentLanguage)}: {paymentData?.service || 'Консультация терапевта'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span>{t('sbpPayment.orderNumber', currentLanguage)}: {paymentData?.orderNumber || '123456789'}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span>{t('sbpPayment.date', currentLanguage)}: {paymentData?.date || new Date().toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US')}</span>
                                    </div>
                                    <div className={styles.amountInfo}>
                                        <span>{t('sbpPayment.amountToPay', currentLanguage)}:</span>
                                        <span className={styles.amount}>{paymentData?.amount || '1 500,00 ₽'}</span>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.startButton}
                                        onClick={handleStartPayment}
                                    >
                                        {t('sbpPayment.startPayment', currentLanguage)}
                                    </button>
                                    
                                    <button 
                                        className={styles.backButton}
                                        onClick={onBack}
                                    >
                                        {t('common.back', currentLanguage)}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className={styles.processing}>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progressFill}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className={styles.progressText}>{t('sbpPayment.checkingPayment', currentLanguage)} {progress}%</p>
                        </div>
                        
                        <div className={styles.processingIcon}>
                            <div className={styles.spinner}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SBPPayment;