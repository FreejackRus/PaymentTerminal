import React, { useState, useEffect } from 'react';
import styles from './CardPayment.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';

const CardPayment = ({ paymentData, onBack, onPaymentComplete }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const { currentLanguage } = useLanguage();

    useEffect(() => {
        if (isProcessing) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            onPaymentComplete();
                        }, 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isProcessing, onPaymentComplete]);

    const handleStartPayment = () => {
        setIsProcessing(true);
    };

    return (
        <div className={styles.wrapper}>
            <ProgressBar currentStep={3} />
            
            <div className={styles.content}>
                <h1 className={styles.title}>{t('cardPayment.title', currentLanguage)}</h1>
                
                {!isProcessing ? (
                    <>
                        <p className={styles.instructions}>
                            {t('cardPayment.instructions', currentLanguage)}
                        </p>
                        
                        <div className={styles.cardSlot}>
                            <p>{t('cardPayment.insertCard', currentLanguage)}</p>
                        </div>
                        
                        <div className={styles.actions}>
                            <button 
                                className={styles.startButton}
                                onClick={handleStartPayment}
                            >
                                {t('cardPayment.startPayment', currentLanguage)}
                            </button>
                            
                            <button 
                                className={styles.backButton}
                                onClick={onBack}
                            >
                                {t('common.back', currentLanguage)}
                            </button>
                        </div>
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
                            <p className={styles.progressText}>{t('cardPayment.processing', currentLanguage)} {progress}%</p>
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

export default CardPayment;