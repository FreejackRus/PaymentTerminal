import React, { useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';
import styles from './MainScreen.module.css';
import Logo from '../../assets/images/logo-vokkdc.svg';
import ArrowIcon from '../../assets/images/arrow-icon.svg';

const MainScreen = ({ onStartPayment }) => {
    const { currentLanguage } = useLanguage();
    const handleStartPayment = useCallback(() => {
        onStartPayment();
    }, [onStartPayment]);



    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <img
                    className={styles.mainLogo}
                    alt={currentLanguage === 'ru' ? 'Логотип ВОККДЦ' : 'VOKKDC Logo'}
                    src={Logo}
                />

                <h1 className={styles.clinicName}>
                    {currentLanguage === 'ru' 
                        ? 'Воронежский областной клинический консультативно-диагностический центр'
                        : 'Voronezh Regional Clinical Advisory and Diagnostic Center'}
                </h1>

                <button
                    className={styles.paymentButton}
                    onClick={handleStartPayment}
                >
                    <span>{t('common.startPayment', currentLanguage)}</span>
                    <img
                        className={styles.arrowIcon}
                        alt=""
                        src={ArrowIcon}
                    />
                </button>
            </div>
        </div>
    );
};

export default MainScreen;