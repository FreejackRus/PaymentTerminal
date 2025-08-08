import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../config/i18n';
import styles from './Header.module.css';
import Logo from '../../assets/images/logo-vokkdc.svg';

const Header = () => {
    const [dateTimeString, setDateTimeString] = useState('');
    const { currentLanguage, changeLanguage, languages } = useLanguage();

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();

            // Форматирование времени (10:23)
            const time = now.toLocaleTimeString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // Форматирование даты
            const weekday = now.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', { 
                weekday: 'short' 
            }).toUpperCase();
            const day = now.getDate();
            const month = now.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', { 
                month: 'long' 
            });
            const year = now.getFullYear();

            setDateTimeString(`${time}, ${weekday}\n${day} ${month} ${year}`);
        };

        updateDateTime();
        const timer = setInterval(updateDateTime, 60000);

        return () => clearInterval(timer);
    }, [currentLanguage]);

    return (
        <div className={styles.header}>
            <div className={styles.logoContainer}>
                <img 
                    src={Logo} 
                    alt={currentLanguage === 'ru' ? 'Логотип ВОККДЦ' : 'VOKKDC Logo'} 
                    className={styles.logo}
                />
            </div>
            <div className={styles.rightSection}>
                <div className={styles.datetimeRow}>
                    <div className={styles.languageToggle}>
                        <button
                            className={`${styles.langButton} ${
                                currentLanguage === 'ru' ? styles.active : ''
                            }`}
                            onClick={() => changeLanguage('ru')}
                        >
                            RU
                        </button>
                        <button
                            className={`${styles.langButton} ${
                                currentLanguage === 'en' ? styles.active : ''
                            }`}
                            onClick={() => changeLanguage('en')}
                        >
                            EN
                        </button>
                    </div>
                    <div className={styles.datetime}>
                        {dateTimeString}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;