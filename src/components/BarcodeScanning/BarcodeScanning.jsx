import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';
import styles from './BarcodeScanning.module.css';
import ProgressBar from '../UI/ProgressBar/ProgressBar';
import BarcodeInput from '../UI/BarcodeInput/BarcodeInput';
import scannerIcon from '../../assets/images/scanner-icon.svg';
import barcodeExample from '../../assets/images/barcode-example-3df7cb.png';
import orderService from '../../services/orderService';

const BarcodeScanning = ({ onBack, onOrderFound }) => {
    const [isScanning, setIsScanning] = useState(false);
    const { currentLanguage } = useLanguage();

    // Добавляем глобальную функцию для тестирования OrderManager
    useEffect(() => {
        window.testOrderManager = async () => {
            console.log('Запуск тестирования OrderManager...');
            const result = await orderService.testOrderManager();
            console.log('Результат тестирования:', result);
            return result;
        };

        // Очистка при размонтировании компонента
        return () => {
            delete window.testOrderManager;
        };
    }, []);

    const handleScan = async (barcode) => {
        setIsScanning(true);
        
        try {
            // Используем orderService для получения данных заказа
            const orderData = await orderService.getOrderInfo(barcode);
            setIsScanning(false);
            onOrderFound(orderData);
        } catch (error) {
            console.error('Ошибка поиска заказа:', error);
            setIsScanning(false);
            // Пробрасываем ошибку дальше - пусть родительский компонент решает что делать
            throw error;
        }
    };

    return (
        <div className={styles.wrapper}>
            <ProgressBar currentStep={1} />
            
            <div className={styles.content}>
                <h1 className={styles.title}>{t('barcodeScanning.title', currentLanguage)}</h1>

                <p className={styles.subtitle}>
                    {t('barcodeScanning.subtitle', currentLanguage)}
                </p>

                <div className={styles.instructionBlock}>
                    <div className={styles.iconContainer}>
                        <img src={scannerIcon} alt="Scanner" className={styles.scannerIcon} />
                    </div>
                    <p className={styles.instructionText}>
                        {t('barcodeScanning.instructionText', currentLanguage)}
                    </p>
                </div>

                <div className={styles.scannerArea}>
                    {isScanning ? (
                        <div className={styles.scanningIndicator}>
                            <div className={styles.spinner}></div>
                            <p>{t('barcodeScanning.searching', currentLanguage)}</p>
                        </div>
                    ) : (
                        <div className={styles.scannerFrame}>
                            <img src={barcodeExample} alt={t('barcodeScanning.title', currentLanguage)} className={styles.barcodeExample} />
                        </div>
                    )}
                </div>

                <p className={styles.manualText}>
                    {t('barcodeScanning.manualText', currentLanguage)}
                </p>

                <div className={styles.inputContainer}>
                    <BarcodeInput
                        placeholder={t('barcodeScanning.placeholder', currentLanguage)}
                        onScan={handleScan}
                        disabled={isScanning}
                        className={styles.input}
                    />
                </div>

                <div className={styles.actions}>
                    <button 
                        className={styles.backButton}
                        onClick={onBack}
                        disabled={isScanning}
                    >
                        {t('barcodeScanning.backButton', currentLanguage)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarcodeScanning;