import { useState } from 'react';
import styles from './OrderInfo.module.css';
import BarcodeInput from '../UI/BarcodeInput/BarcodeInput';
import Barcode from '../../assets/images/barcode.png';


const OrderInfo = () => {
    const [barcode, setBarcode] = useState('');

    const handleSearch = () => {
        console.log('Поиск штрих-кода:', barcode);
        // Логика обработки штрих-кода
    };

    const PaymentStage = ({ onBack, onComplete }) => {
        const handlePaymentSuccess = () => {
            onComplete();
        };
    
        return (
            <div className={styles.wrapper}>
                <div className={styles.centeredContainer}>
                    <h1 className={styles.title}>Сканирование штрих-кода</h1>
    
                    <div className={styles.instructions}>
                        <p>Для получения информации о платеже, пожалуйста,</p>
                        <p>отсканируйте штрих-код на вашем направлении </p>
                        <p>или квитанции.</p>
    
                        <div className={styles.scanGuide}>
                            <div className={styles.checkboxLine}>
                                <span className={styles.checkbox}>✓</span>
                                <span>Поднесите штрих-код к сканеру, расположенному ниже экрана.</span>
                            </div>
                            <div className={styles.indentedText}>Держите штрих-код на расстоянии 10-15 см от сканера.</div>
                        </div>
                    </div>
    
                    <div className={styles.divider} />
    
                    <img className={styles.image1Icon} alt="" src={Barcode} />
    
    
                    <div className={styles.fallbackSection}>
                        <p>Если сканирование не удается, вы можете ввести номер вручную:</p>
    
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                placeholder="Введите номер штрих-кода"
                                className={styles.inputField}
                            />
                            <button
                                className={styles.searchButton}
                                onClick={handleSearch}
                            >
                                Поиск
                            </button>
                            <button onClick={onBack}>Назад</button>
                            <button onClick={handlePaymentSuccess}>Завершить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default OrderInfo;