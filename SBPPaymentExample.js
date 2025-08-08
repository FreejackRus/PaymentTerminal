import React from 'react';
import SBPPayment from './SBPPayment';

/**
 * Пример использования компонента SBPPayment
 * Этот файл показывает, как использовать компонент для оплаты через СБП
 */

class SBPPaymentExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 2000, // Сумма в рублях
            orderNumber: '019278296',
            patientData: 'ТОТ ЖЕ'
        };
    }

    handlePaymentSuccess = () => {
        console.log('Платеж успешно завершен!');
        // Здесь можно добавить логику после успешной оплаты
        // Например: перенаправление на страницу успеха
    };

    render() {
        return (
            <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h2>Пример оплаты через СБП</h2>
                
                <div style={{ marginBottom: '20px' }}>
                    <h3>Детали заказа:</h3>
                    <p><strong>Сумма:</strong> {this.state.amount} руб.</p>
                    <p><strong>Номер заказа:</strong> {this.state.orderNumber}</p>
                    <p><strong>Пациент:</strong> {this.state.patientData}</p>
                </div>

                {/* Компонент оплаты СБП */}
                <SBPPayment
                    amount={this.state.amount}
                    orderNumber={this.state.orderNumber}
                    patientData={JSON.stringify(this.state.patientData)}
                    onPaymentSuccess={this.handlePaymentSuccess}
                />

                <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <h4>Как использовать компонент:</h4>
                    <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`<SBPPayment
    amount={2000} // сумма в рублях
    orderNumber="019278296" // номер заказа как в примере
    patientData="ТОТ ЖЕ" // данные пациента
    onPaymentSuccess={this.handlePaymentSuccess} // callback при успешной оплате
/>`}
                    </pre>
                </div>
            </div>
        );
    }
}

export default SBPPaymentExample;