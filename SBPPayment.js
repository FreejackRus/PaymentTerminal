import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

/**
 * Компонент для оплаты через СБП (Система быстрых платежей)
 * Можно использовать отдельно от основного виджета
 */
@inject('basketStore')
@observer
class SBPPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sbpIsOpen: false,
            sbpIsLoading: false,
            sbpText: '',
            sbpInterval: null,
            transactionId: null,
            paymentStatus: null
        };
    }

    // Инициализация оплаты СБП
    handleSBP = async (amount, orderNumber, patientData) => {
        try {
            this.setState({
                sbpIsLoading: true,
                sbpText: 'Создание платежа...'
            });

            const transactionId = await this.props.basketStore.saveTransactionSBP(
                amount, 
                orderNumber, 
                patientData
            );

            if (transactionId) {
                this.setState({
                    transactionId,
                    sbpIsOpen: true,
                    sbpText: 'Ожидание оплаты...'
                });

                // Открытие формы СБП в новом окне для мобильных
                if (this.isMobile()) {
                    window.open(this.props.basketStore._sbpFormUrl, '_blank');
                }

                // Запуск проверки статуса платежа
                this.startPaymentCheck(transactionId);
            }
        } catch (error) {
            this.setState({
                sbpText: 'Ошибка при создании платежа',
                sbpIsLoading: false
            });
        }
    };

    // Проверка статуса платежа
    startPaymentCheck = (transactionId) => {
        const interval = setInterval(async () => {
            try {
                const result = await this.props.basketStore.checkTransactionSBP(transactionId);
                
                if (result.status) {
                    this.setState({
                        paymentStatus: 'success',
                        sbpText: result.text || 'Платеж успешно завершен'
                    });
                    this.clearPaymentCheck();
                    this.props.onPaymentSuccess && this.props.onPaymentSuccess();
                } else {
                    this.setState({
                        sbpText: result.text || 'Ожидание оплаты...'
                    });
                }
            } catch (error) {
                this.setState({
                    sbpText: 'Ошибка при проверке статуса'
                });
            }
        }, 3000);

        this.setState({ sbpInterval: interval });
    };

    // Очистка интервала проверки
    clearPaymentCheck = () => {
        if (this.state.sbpInterval) {
            clearInterval(this.state.sbpInterval);
            this.setState({ sbpInterval: null });
        }
    };

    // Проверка мобильного устройства
    isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Закрытие формы оплаты
    closeSBP = () => {
        this.setState({
            sbpIsOpen: false,
            sbpText: '',
            paymentStatus: null
        });
        this.clearPaymentCheck();
    };

    // Отрисовка формы СБП
    renderSBP = () => {
        if (!this.state.sbpIsOpen) return null;

        return (
            <div style={styles.sbpContainer}>
                <div style={styles.sbpModal}>
                    <div style={styles.sbpHeader}>
                        <h3>Оплата через СБП</h3>
                        <button onClick={this.closeSBP} style={styles.closeButton}>×</button>
                    </div>
                    
                    <div style={styles.sbpContent}>
                        {this.isMobile() ? (
                            <div style={styles.mobileInstructions}>
                                <p>{this.state.sbpText}</p>
                                <p>Форма оплаты открыта в новом окне</p>
                            </div>
                        ) : (
                            <iframe
                                src={this.props.basketStore._sbpFormUrl}
                                style={styles.sbpIframe}
                                frameBorder="0"
                                title="СБП Оплата"
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { amount, orderNumber, patientData } = this.props;

        return (
            <div style={styles.container}>
                <button
                    onClick={() => this.handleSBP(amount, orderNumber, patientData)}
                    disabled={this.state.sbpIsLoading}
                    style={{
                        ...styles.sbpButton,
                        ...(this.state.sbpIsLoading ? styles.sbpButtonDisabled : {})
                    }}
                >
                    {this.state.sbpIsLoading ? 'Создание платежа...' : 'Оплатить через СБП'}
                </button>

                {this.state.sbpText && !this.state.sbpIsOpen && (
                    <div style={styles.statusText}>
                        {this.state.sbpText}
                    </div>
                )}

                {this.renderSBP()}
            </div>
        );
    }
}

// Стили для компонента
const styles = {
    container: {
        margin: '20px 0',
        textAlign: 'center'
    },
    sbpButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    },
    sbpButtonDisabled: {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
    },
    statusText: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#666'
    },
    sbpContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    sbpModal: {
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'hidden'
    },
    sbpHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid #eee'
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#999'
    },
    sbpContent: {
        padding: '20px'
    },
    sbpIframe: {
        width: '100%',
        height: '500px',
        border: 'none'
    },
    mobileInstructions: {
        textAlign: 'center',
        padding: '20px'
    }
};

export default SBPPayment;