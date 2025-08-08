import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { t } from '../../../config/i18n';
import styles from './BarcodeInput.module.css';

const BarcodeInput = ({ placeholder, onScan, disabled }) => {
    const [value, setValue] = useState('');
    const { currentLanguage } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim() && onScan) {
            onScan(value.trim());
            setValue('');
        }
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <form className={styles.inputContainer} onSubmit={handleSubmit}>
            <input
                type="text"
                className={styles.inputField}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={disabled}
            />
            <button
                type="submit"
                className={styles.searchButton}
                disabled={disabled || !value.trim()}
            >
                {t('barcodeScanning.searchButton', currentLanguage)}
            </button>
        </form>
    );
};

export default BarcodeInput;