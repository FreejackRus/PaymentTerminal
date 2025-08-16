import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';
import styles from './InactivityDialog.module.css';

const InactivityDialog = ({ isOpen, onContinue, onCancel }) => {
  const { currentLanguage } = useLanguage();
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    if (isOpen) {
      setCountdown(20);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onCancel();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onCancel]);

  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} inactivity-dialog`}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {t('inactivityDialog.title', currentLanguage)}
          </h2>
          <p className={styles.message}>
            {t('inactivityDialog.message', currentLanguage)}
          </p>
          <p className={styles.countdown}>
            {t('inactivityDialog.countdown', currentLanguage).replace('{seconds}', countdown)}
          </p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            {t('inactivityDialog.cancel', currentLanguage)}
          </button>
          <button 
            className={styles.continueButton}
            onClick={handleContinue}
          >
            {t('inactivityDialog.continue', currentLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityDialog;