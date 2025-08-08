import React from "react";
import Spinner from "../components/spinner";
import {inject, observer} from "mobx-react/index";
import "./payment.css";
import config from "../../../config";
import Paper from "material-ui/Paper";
import * as path from "path";
const { createWidget } = window['payment-widget'];

class Payment extends React.Component {


    static get defaultProps() {
        return Object.assign({}, super.defaultProps, {});
    }

    static get propTypes() {
        return Object.assign({}, super.propTypes, {});
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state, {
            sberIsOpen: false,
            sberIsLoading: false,
            sberpayIsOpen: false,
            sberpayIsLoading: false,
            sbpIsOpen: false,
            sbpIsLoading: false,
            sbpText: undefined,
            sbpInterval: undefined,
        });

        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.sbpText !== prevState.sbpText) {
            clearInterval(this.state.sbpInterval);
            this.setState({...this.state, sbpInterval: undefined});
        }
    }

    isMobile() {
        return /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent);
    }

    handleSberButton() {
        if (!this.state.sberIsOpen) {
            this.setState({sberIsLoading: true});

            this.props.subBasketStore.clearSubBasket();
            this.props.setBookingIsDone(true);

            const {
                patientBirthDate,
                patientLastname,
                patientFirstname,
                patientMiddlename,
                userIsPatient
            } = this.props.userStore;
            const patientData = userIsPatient ? "ТОТ ЖЕ" : `${patientLastname};${patientFirstname};${patientMiddlename};${patientBirthDate};;`;
            this.props.basketStore.payOrder(this.props.basketStore.agreementAmount, this.props.basketStore.paymentNumber, patientData).then((url) => {
                if (url === "") {
                    this.props.basketStore.setPayment(true, false, "");
                } else {
                    this.props.basketStore.setPayment(true, true, url);
                    this.setState({
                        sberIsOpen: true,
                        sberIsLoading: false,
                    });
                }
            }).then(() => {
                this.props.resetRouter(1);
            });
        }
    }

    renderSber() {

        return (<iframe id="sberbank-frame" src={this.props.basketStore.getPaymentData.url}
                        style={{border: `none`, width: `100%`, height: `75vh`}}>
            Обратитесь в регистратуру поликлиники 27-20-205.
            Номер заказа {this.props.basketStore.basketNumber}
        </iframe>);
    }
    renderSberPay() {
        // return (
        //     <div style={{ width: '100%', height: '48vh', overflow: 'hidden' }}>
        //         <iframe
        //             id="sberpay-frame"
        //             src={this.props.basketStore._sberPayUrl}
        //             style={{
        //                 width: '100%',
        //                 height: '96vh', // Двойная высота контейнера для обрезки
        //                 border: 'none',
        //                 clipPath: 'inset(0 0 52% 0)',
        //                 overflow: 'hidden'
        //             }}
        //             scrolling="no"
        //         >
        //             Обратитесь в регистратуру поликлиники 27-20-205.
        //             Номер заказа {this.props.basketStore.basketNumber}
        //         </iframe>
        //     </div>
        // );
    }




    renderSBP() {
        return <iframe id="sbp-frame" src={this.props.basketStore._sbpFormUrl}
                       style={{border: `none`, width: `100%`, height: `75vh`}}>
            Обратитесь в регистратуру поликлиники 27-20-205.
            Номер заказа {this.props.basketStore.basketNumber}
        </iframe>
    }

    clickSberPay(widget) {
        const {
            patientBirthDate,
            patientLastname,
            patientFirstname,
            patientMiddlename,
            userIsPatient
        } = this.props.userStore;
        const patientData = userIsPatient ? "ТОТ ЖЕ" : `${patientLastname};${patientFirstname};${patientMiddlename};${patientBirthDate};;`;

        this.props.basketStore.paySberPayOrder(this.props.basketStore.agreementAmount, this.props.basketStore.paymentNumber, patientData)
            .then((url) => {
                if (url) {
                    // Открыть iframe с оплатой через Сбер
                    this.setState({
                        sberpayIsOpen: true,
                        sberpayIsLoading: false,
                    });
                    this.props.basketStore.setPayment(true, true, url);
                    const params = {
                        backUrl: this.props.basketStore._sberPayUrl,
                        bankInvoiceId: this.props.basketStore._orderId,
                    };
                    console.log(params);
                    const url = `https://platiecom.ru/?orderId=`+params.bankInvoiceId.toString()+`&params=eyJiYWNrVXJsIjoiaHR0cHM6Ly9wYXllY29tLnJ1L3BheV9ydT9vcmRlcklkPTU1NDdiMjAxLWVlMmQtNTc5NC0xYjk4LTA2MGZjN2JjYzE1ZSIsImJhbmtJbnZvaWNlSWQiOiI1NTQ3YjIwMS1lZTJkLTU3OTQtMWI5OC0wNjBmYzdiY2MxNWUiLCJvcmRlcklkIjoiNTU0N2IyMDEtZWUyZC01Nzk0LTFiOTgtMDYwZmM3YmNjMTVlIiwiaHJlZiI6Imh0dHBzOi8vdGVzdHZva2tkYy50bS12LnJ1Lz9yZWNvcmRpbmc9JmJhY2tfdXJsX2FkbWluPSUyRmJpdHJpeCUyRmFkbWluJTJGJTNGbGFuZyUzRHJ1JmNsZWFyX2NhY2hlPVkmX3I9NzkyMyNyZWNlaXB0IiwiaG9zdCI6InRlc3R2b2trZGMudG0tdi5ydSJ9`;
                    console.log(url);
                    if (this.isMobile()) {
                        // Открываем новую вкладку для мобильной версии
                        const newTab = window.open(url, '_blank');
                    } else {
                        // Открываем виджет на текущей странице для десктопной версии
                        widget.open(params);
                    }
                    const observer = new MutationObserver((mutationsList, observer) => {
                        mutationsList.forEach((mutation) => {
                            // Проверяем, был ли добавлен элемент с нужным id и классом
                            const element = document.querySelector('.root.svelte-1s6dmb5');
                            if (element) {
                                element.style.zIndex = '99999'; // Устанавливаем z-index
                                observer.disconnect(); // Останавливаем наблюдателя, когда элемент найден
                            }
                        });
                    });

                    // Настройка observer
                    const config = { childList: true, subtree: true }; // Следим за добавлением дочерних элементов в DOM
                    observer.observe(document.body, config);

                    if(this.isMobile())
                        widget.open(params);

                } else {
                    this.props.basketStore.setPayment(true, false, "");
                }
            })
            .then(() => {
                this.props.resetRouter(1);
            });
    }
    handleSBP() {
        const {
            patientBirthDate,
            patientLastname,
            patientFirstname,
            patientMiddlename,
            userIsPatient
        } = this.props.userStore;
        const patientData = userIsPatient ? "ТОТ ЖЕ" : `${patientLastname};${patientFirstname};${patientMiddlename};${patientBirthDate};;`;
        if (!this.state.sbpIsOpen) {
            this.setState({sbpIsLoading: true});
            this.props.basketStore.saveTransactionSBP(this.props.basketStore.agreementAmount, this.props.basketStore.paymentNumber, patientData)
                .then((transactionID) => {
                    if (transactionID) {
                        if (this.isMobile()) {
                            this.setState({
                                sbpIsOpen: false,
                                sbpIsLoading: false,
                                sbpInterval: setInterval(() => {
                                    this.props.basketStore.checkTransactionSBP(transactionID).then((payment) => {
                                        if (payment.text) {
                                            this.setState({
                                                ...this.state,
                                                sbpIsOpen: false,
                                                sbpText: payment.status ? 'Оплата успешно произведена' : payment.text,
                                            });
                                        }
                                    })
                                }, 5000),
                            });
                            window.open(this.props.basketStore._sbpFormUrl, '_blank');
                        }
                        else {
                            this.setState({
                                sbpIsOpen: true,
                                sbpIsLoading: false,
                                sbpInterval: setInterval(() => {
                                    this.props.basketStore.checkTransactionSBP(transactionID).then((payment) => {
                                        if (payment.text) {
                                            this.setState({
                                                ...this.state,
                                                sbpIsOpen: false,
                                                sbpText: payment.status ? 'Оплата успешно произведена' : payment.text,
                                            });
                                        }
                                    })
                                }, 5000),
                            });
                        }
                    }
                })
        }
    }

    render() {
        const widget = createWidget('PRODUCTION');
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const {sberIsOpen, sberIsLoading,sberpayIsOpen, sberpayIsLoading,  sbpIsOpen, sbpIsLoading} = this.state;
        let sberStyle = "payment-switch-button " + (this.state.sberIsOpen ? "payment-switch-button-selected" : '');
        return <div>
            <div className="payments-switch">
                <button className={sberStyle} onClick={() => this.handleSBP()}>СБП (QR-код)</button>
                <button className={sberStyle} onClick={() => this.handleSberButton()}> Банковской картой</button>
                <button className={sberStyle} onClick={() => this.clickSberPay(widget)}>Карты Сбера</button>
            </div>

            <div>
                {sberpayIsLoading ? <Spinner inverse/> : ''}
                {sberpayIsOpen ? this.renderSberPay() : ''}
            </div>

            <div>
                {sberIsLoading ? <Spinner inverse/> : ''}
                {sberIsOpen ? this.renderSber() : ''}
            </div>

            {this.state.sbpText ?
                <Paper style={{margin: "1em", padding: '2em', display: 'flex', justifyContent: 'center'}}>
                    <h2>{this.state.sbpText}</h2>
                </Paper> : ''}

            <div>
                {sbpIsLoading ? <Spinner inverse/> : ''}
                {sbpIsOpen ? this.renderSBP() : ''}
            </div>

            {urlParams.has('qr') && urlParams.has('docId') &&
                <button className='another-qr-services' onClick={() => this.props.returnToView()}> Записаться на другое
                    назначение </button>}
        </div>
    }
}

export default inject('basketStore', 'subBasketStore', 'userStore', 'doctorStore', 'groupsStore')(observer(Payment));