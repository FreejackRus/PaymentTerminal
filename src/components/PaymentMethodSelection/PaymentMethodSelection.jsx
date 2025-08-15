import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';
import styles from './PaymentMethodSelection.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';
import ArrowIcon from '../../assets/images/arrow-icon.svg';
import CardIcon from '../../assets/images/card-icon.svg';
import SBPIcon from '../../assets/images/sbp-icon.svg';
import WarningIcon from '../../assets/images/warning-icon.svg';

const PaymentMethodSelection = ({ paymentData, onBack, onCardPayment, onSBPPayment }) => {
    const { currentLanguage } = useLanguage();
    return (
        <div className={styles.wrapper}>
            <ProgressBar currentStep={3} />
            
            <div className={styles.content}>
                <h1 className={styles.title}>{t('paymentMethods.title', currentLanguage)}</h1>
                <p className={styles.subtitle}>{t('paymentMethods.subtitle', currentLanguage)}</p>
                
                <div className={styles.orderInfo}>
                    <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>{t('paymentMethods.orderNumber', currentLanguage)}:</span>
                        <span className={styles.orderValue}>{paymentData?.orderNumber || 'МЕД-12345678'}</span>
                    </div>
                    <div className={styles.orderRow}>
                        <span className={styles.orderLabel}>{t('paymentMethods.service', currentLanguage)}:</span>
                        <span className={styles.orderValue}>{paymentData?.service || 'Консультация терапевта'}</span>
                    </div>

                    <div className={`${styles.orderRow} ${styles.totalRow}`}>
                        <span className={styles.orderLabel}>{t('paymentMethods.totalAmount', currentLanguage)}:</span>
                        <span className={styles.orderValue}>{paymentData?.total} ₽</span>
                    </div>
                </div>
                
                <div className={styles.paymentMethods}>
                    {/* Временно скрыта оплата картой */}
                    {/* <button 
                        className={styles.paymentMethod}
                        onClick={onCardPayment}
                    >
                        <div className={styles.methodContent}>
                            <img
                                className={styles.methodIcon}
                                alt="Банковская карта"
                                src={CardIcon}
                            />
                            <div className={styles.methodInfo}>
                                <span className={styles.methodTitle}>{t('paymentMethods.cardPayment', currentLanguage)}</span>
                                <span className={styles.methodSubtitle}>{t('paymentMethods.cardSubtitle', currentLanguage)}</span>
                                <span className={styles.methodDescription}>{t('paymentMethods.cardDescription', currentLanguage)}</span>
                            </div>
                        </div>
                        <img
                            className={styles.arrowIcon}
                            alt=""
                            src={ArrowIcon}
                        />
                    </button> */}
                    
                    <button 
                        className={styles.paymentMethod}
                        onClick={onSBPPayment}
                    >
                        <div className={styles.methodContent}>
                            <img
                                className={styles.methodIcon}
                                alt="СБП"
                                src={SBPIcon}
                            />
                            <div className={styles.methodInfo}>
                                <span className={styles.methodTitle}>{t('paymentMethods.sbpPayment', currentLanguage)}</span>
                                <span className={styles.methodSubtitle}>{t('paymentMethods.sbpSubtitle', currentLanguage)}</span>
                                <span className={styles.methodDescription}>{t('paymentMethods.sbpDescription', currentLanguage)}</span>
                            </div>
                        </div>
                        <img
                            className={styles.arrowIcon}
                            alt=""
                            src={ArrowIcon}
                        />
                    </button>
                </div>
                
                <div className={styles.warningBlock}>
                    <img
                        className={styles.warningIcon}
                        alt={currentLanguage === 'ru' ? 'Предупреждение' : 'Warning'}
                        src={WarningIcon}
                    />
                    <div className={styles.warningText}>
                        <p>{t('paymentMethods.warning1', currentLanguage)}</p>
                        <p>{t('paymentMethods.warning2', currentLanguage)}</p>
                    </div>
                </div>
                
                <button 
                    className={styles.backButton}
                    onClick={onBack}
                >
                    {t('common.back', currentLanguage)}
                </button>
            </div>
        </div>
    );
};

export default PaymentMethodSelection;