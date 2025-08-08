import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../config/i18n';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ currentStep = 1 }) => {
    const { currentLanguage } = useLanguage();
    const steps = [
        t('progressSteps.scanning', currentLanguage),
        t('progressSteps.paymentInfo', currentLanguage),
        t('progressSteps.payment', currentLanguage),
        t('progressSteps.result', currentLanguage)
    ];
    return (
        <div className={styles.progressBar}>
            {steps.map((step, index) => (
                <div key={index} className={styles.stepContainer}>
                    <div 
                        className={`${styles.step} ${
                            index + 1 <= currentStep ? styles.active : ''
                        }`}
                    >
                        {index + 1}
                    </div>
                    <span 
                        className={`${styles.stepLabel} ${
                            index + 1 <= currentStep ? styles.activeLabel : ''
                        }`}
                    >
                        {step}
                    </span>
                    {index < steps.length - 1 && (
                        <div 
                            className={`${styles.connector} ${
                                index + 1 < currentStep ? styles.activeConnector : ''
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;