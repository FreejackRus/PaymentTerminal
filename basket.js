import config from "../config";
import fetchJsonp from "fetch-jsonp";
import {extendObservable, action} from "mobx";
import moment from 'moment';
import QuestionnaireStore from "./questionnaire";

export default class BasketStore {


    constructor() {
        extendObservable(this, {
            _basketNumber: 0,
            _formUrl: "",
            _sberPayUrl: "",
            _sbpFormUrl: "",
            _basket: [],
            _items: {},
            isLoading: false,
            isLoadingFirst: false,
            isLoadingSecond: false,
            _paymentNumber: 0,
            _agreementAmount: 2000,
            _laboratoryRecords: [],
            _isPossibleSecondConsultation: false,
            _workingCalendar: {
                loaded: false,
                data: [],
            },
            _error: {
                status: false,
                message: "",
                returnToFirsView: true,
            },
            _agreement: {
                isAgreement: false,
                status: false,
                data: "",
            },
            _payment: {
                isPayment: false,
                status: false,
                url: "",
            },
            _laboratoryBasket: [],
            _groupsOfServise: [],

            get BasketItemCount() {
                return this._basket.length
            },

            get data() {
                return this._basket;
            },

            get services() {
                return this._basket.filter((item) => item.type === "service");
            },

            get laboratory() {
                return this._basket.filter((item) => item.type === "laboratory");
            },

            get servicesCount() {
                return this._basket.reduce((count, item) => item.type === "service" ? count + 1 : count, 0);
            },

            get laboratoryCount() {
                return this._basket.reduce((count, item) => item.type === "laboratory" ? count + 1 : count, 0);
            },

            get basketNumber() {
                return this._basketNumber
            },

            get paymentNumber() {
                return this._paymentNumber
            },

            get totalAmount() {
                return this._basket.reduce((sum, service) => Number(service.price) + Number(sum), 0);
            },

            get agreementAmount() {
                return this._agreementAmount
            },

            get isError() {
                return this._error.status;
            },

            get getErrorMessage() {
                return this._error.message;
            },

            get getErrorNeedReturn() {
                return this._error.returnToFirsView;
            },

            /*    get getErrorFunction() {
                    return this._error.func;
                }*/
            get getAgreementData() {
                return this._agreement;
            },

            get getPaymentData() {
                return this._payment;
            },

            get isPossibleSecondConsultation() {
                return this._isPossibleSecondConsultation;
            },
            get workingCalendar() {
                return this._workingCalendar;
            },

        })
    }


    setPossibleSecondConsultation = action((status) => {
        this._isPossibleSecondConsultation = status;
    });

    setAgreement = action((type, status, data) => {
        this._agreement.isAgreement = type;
        this._agreement.status = status;
        this._agreement.data = data;
    });

    setPayment = action((type, status, data) => {
        this._payment.isPayment = type;
        this._payment.status = status;
        this._payment.url = data;
    });

    setError = action((status, message, returnToFirsView) => {
        this._error.status = status;
        this._error.message = message;
        this._error.returnToFirsView = returnToFirsView;
        if (status) {
            this.isLoading = false;
        }
    });

    setRecord = action((record) => {
        if (this.servicesCount === 0 && (record.type === "service" || record.type === "group") && this.basketNumber === 0) {
            this._basketNumber = record.id.replace(/\s/g, "") || 0;
        }
        if (record.type === "laboratory") {
            this.deleteFromBasket(record.id);
        }
        this._basket.push({
            id: record.id.replace(/\s/g, ""),
            serviceId: record.serviceId,
            branch: record.branch,
            doctorId: record.doctorId,
            dateTime: record.dateTime,
            type: record.type,
            price: record.price,
            specialist: record.specialist,
            cabinet: record.cabinet,
            date: record.date,
            place: record.place,
            time: record.time,
            patient: record.patient,
            service: record.service,
            message: record.message,
            secondInTheBasket: record.secondInTheBasket,
        });
    });

    resetBasketNumIfNeed = action(() => {
        const haveServiceInOrder = this._basket.some((item) => {
            if (item.type === "service") {
                this._basketNumber = item.id;
            }
            return item.type === "service";
        })
        if (!haveServiceInOrder) {
            this._basketNumber = 0;
        }
    });

    //удаляет услугу из корзины, если она существует
    deleteFromBasket = action((id) => {
        this._basket = this._basket.filter((item) => item.id !== id.replace(/\s/g, ""));
        this.resetBasketNumIfNeed();

    });

    deleteSecondaryConsultation = action((id) => {
        if (this._basket.length > 0) {
            const currentRecord = this._basket.filter((item) => item.id === id.replace(/\s/g, ""));
            const hasSecondary = this._basket
                .reduce((status, record) => {
                        if (record.secondInTheBasket.status && Number(record.secondInTheBasket.primaryCode) === Number(currentRecord[0].serviceId)) {

                            return {status: true, recordId: record.id}
                        }
                        return {status: false}
                    }
                    , {status: false}
                );
            if (hasSecondary.status) {
                this.removeService(hasSecondary.recordId);
                return true;
            }
        }
        return false;
    });

    loadingChange(isPrimary) {
        if (isPrimary) {
            this.isLoadingSecond = false;
            if (!this.isLoadingFirst) {
                this.isLoading = false;
            }
        } else {
            this.isLoadingFirst = false;
            if (!this.isLoadingSecond) {
                this.isLoading = false;
            }
        }
    }

    //удаляет услугу из 1С, если пользователь записан на такую услугу(перезапись) или по клику в корзине
    removeService = action((id) => {
        let primary = false;
        this.isLoading = true;
        this.isLoadingFirst = true;
        if (this.deleteSecondaryConsultation(id)) {
            this.isLoadingSecond = true;
            primary = true;
        }
        return new Promise((resolve, reject) => {
            const urlReset = `${config.baseUrl}/remove-record` +
                `?recordId=${encodeURIComponent(id)}`;
            fetchJsonp(urlReset).then((responseReset) => {
                return responseReset.json();
            }).then((data) => {
                if (data.result) {
                    this.deleteFromBasket(id);
                    this.loadingChange(primary);
                } else {
                    this.setError(true, data.message, true);
                    resolve(data);
                }
                if (this._basketNumber === id) {
                    this.resetBasketNumIfNeed();
                }
                return resolve(data);
            }).catch((error) => {
                this.setError(true, error, false);
                this.loadingChange(primary);
                reject(error);
            });
        });
    });

    payOrder = action((cost, basketId, patientData) => {
        return new Promise((resolve, reject) => {
            const url = `${config.baseUrl}/register-order` +
                `?amount=${cost}` +
                `&orderNumber=${basketId}` +
                `&returnUrl=${config.baseUrl}/pay-order` +
                `&patientData=${encodeURIComponent(patientData)}` +
                `&data=`;
            fetchJsonp(url, {
                timeout: 10000,
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status === true) {
                    this._formUrl = data.formUrl;
                    resolve(data.formUrl)
                } else {
                    resolve("");
                }
            }).catch(() => {
                reject("");
                return {status: false, formUrl: ""}
            });
        });
    });

    paySberPayOrder = action((cost, basketId, patientData) => {
        return new Promise((resolve, reject) => {
            const url = `${config.baseUrl}/register-order-sber-pay` +
                `?amount=${cost}` +
                `&orderNumber=${basketId}` +
                `&returnUrl=${config.baseUrl}/pay-order` +
                `&patientData=${encodeURIComponent(patientData)}` +
                `&data=`;
            fetchJsonp(url, {
                timeout: 10000,
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status === true) {
                    this._sberPayUrl = data.formUrl;
                    this._orderId = data.order;
                    resolve(data.formUrl)
                } else {
                    resolve("");
                }
            }).catch(() => {
                reject("");
                return {status: false, formUrl: ""}
            });
        });
    });

    saveTransactionSBP = action((cost, basketId, patientData) => {
        return new Promise((resolve, reject) => {
            const url = `${config.baseUrl}/save-transaction-sbp` +
                `?orderNumber=${basketId}` +
                `&amount=${cost}` +
                `&patientData=${patientData}`;
            fetchJsonp(url, {
                timeout: 10000,
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status === true) {
                    this._sbpFormUrl = data.formUrl;
                    resolve(data.transactionID)
                } else {
                    reject(undefined);
                }
            }).catch(() => {
                reject(undefined);
            });
        });
    });

    checkTransactionSBP = action((transactionID) => {
        return new Promise((resolve, reject) => {
            const url = `${config.baseUrl}/check-transaction-sbp` +
                `?transactionID=${transactionID}`;
            fetchJsonp(url, {
                timeout: 10000,
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status === true) {
                    if (data.result) {
                        resolve({status: data.result, text: data.text});
                    } else {
                        reject({status: data.result, text: data.text});
                    }
                } else {
                    reject({status: undefined});
                }
            })
        })
    })

    recordService = action((user, serviceId, doctorId, dateTime, isSecondConsultation, patientBDate) => {
        return new Promise((resolve, reject) => {
            let url = `${config.baseUrl}/record` +
                `?surname=${encodeURIComponent(user.lastname)}` +
                `&name=${encodeURIComponent(user.firstname)}` +
                `&patronymic=${encodeURIComponent(user.patronymic)}` +
                `&phone=${encodeURIComponent(user.phone)}` +
                `&email=${encodeURIComponent(user.email)}` +
                `&birthDate=${encodeURIComponent(user.bDate)}` +
                `&productId=${encodeURIComponent(serviceId)}` +
                `&specId=${encodeURIComponent(doctorId)}` +
                `&UTCDateTime=${encodeURIComponent(dateTime)}` +
                `&patientBirthDate=${encodeURIComponent(patientBDate)}`;
            if (isSecondConsultation) {
                url += `&isSecondConsultation=${encodeURIComponent(isSecondConsultation)}`;
            }
            if (this.BasketItemCount > 0 && this.basketNumber > 0) {
                url += `&basket=${encodeURIComponent(this.basketNumber.replace(/\s/g, ""))}`;
            }
            fetchJsonp(url, {timeout: 8000}).then((response) => {
                return response.json();
            }).then((responseJson) => {
                if (responseJson.result) {
                    resolve(responseJson);
                } else {
                    if (responseJson.record !== 0) {
                        this.removeService(responseJson.record).then((data) => {
                            if (data.result) {
                                return this.recordService(user, serviceId, doctorId, dateTime, isSecondConsultation, patientBDate)
                                    .then((data) => {
                                        this._items = data;
                                        resolve(this._items);
                                        return this._items;

                                    });
                            }
                        });
                    } else {
                        resolve(responseJson);
                    }
                }
            }).catch((error) => {
                this.setError(true, 'Не удалось выполнить запрос. Попробуйте повторить попытку.', false);
                reject(error);
            });
        });
    });

    getAgreement = action((basketNumber) => {
        this.isLoading = true;
        return new Promise((resolve, reject) => {
            let url = `${config.baseUrl}/get-agreement` +
                `?recordId=${encodeURIComponent(basketNumber)}`;
            fetchJsonp(url, {timeout: 8000}).then((response) => {
                return response.json();
            })
                .then((responseJson) => {
                        this._agreementAmount = Number(responseJson.totalAmount);
                        this.isLoading = false;
                        return resolve(responseJson)
                    }
                )
                .catch((error) => {
                    this.isLoading = false;
                    reject(error);
                });
        });
    });

    recordLaboratory = action((patient) => {
        return new Promise((resolve) => {
            const orders = this.getGroupLaboratoryByDate();
            if (this._basketNumber === 0) {
                const first = orders[0];
                const last = orders.filter((item, index) => index > 0);
                this.recordingLaboratory([first], patient, 0).then(i => i.map(result => result.then(r => {
                    this._basketNumber = r.OrderNumber.replace(/\s/g, "") || 0;
                    return r;
                }))).then(r => {
                    if (last.length > 0) {
                        return this.recordingLaboratory(last, patient, this._basketNumber).then(i =>
                            i.map(result => result.then(r => {
                            })));
                    } else {
                        return r;
                    }
                }).then(result => {
                    return result;
                }).then(result => resolve(result));

            } else {
                this.recordingLaboratory(orders, patient, this._basketNumber).then(result => resolve(result));
            }
        });
    });


    getGroupLaboratoryByDate = action(() => {
        const laboratory = this._basket.filter((item) => item.type === "laboratory");
        return laboratory.reduce((acc, item) => {
            const element = acc.reduce((acc1, item1) => (item1.date === item.date) ? item1 : acc1, {});
            if (element.date !== undefined) {
                const arr = acc.filter((item2) => item2 !== element);
                arr.push({utcDate: item.dateTime, codes: item.serviceId + "," + element.codes, date: item.date});
                return arr;
            }
            acc.push({utcDate: item.dateTime, codes: item.serviceId, date: item.date});
            return acc
        }, []);
    });

    recordingLaboratory = action((orders, patient, basket) => {
        let recordsPromice = orders.map((item) => {
            let url = `${config.baseUrl}/laboratory-record-get` +
                `?surname=${encodeURIComponent(patient.lastname)}` +
                `&name=${encodeURIComponent(patient.firstname)}` +
                `&patronymic=${encodeURIComponent(patient.patronymic)}` +
                `&phone=${encodeURIComponent(patient.phone)}` +
                `&email=${encodeURIComponent(patient.email)}` +
                `&birthDate=${encodeURIComponent(patient.bDate)}` +
                `&productsId=${encodeURIComponent(item.codes)}` +
                `&UTCDateTime=${encodeURIComponent(item.utcDate)}`;
            if (basket > 0) {
                url += `&basket=${encodeURIComponent(this._basketNumber)}`;
            }
            return fetchJsonp(url, {timeout: 8000})
        });
        return Promise.all(recordsPromice)
            .then(response => {
                return response.map(item => item.json());
            })
            .then(r => {
                this._basket.filter((item) => item.type === "laboratory").forEach(e => e.message = 'В записи отказано');
                return r.map(i => {
                    i.then(res => {
                        this.checkForRejectLaboratory(res.Structure ? res.Structure.map((e) => e.enc_value) : [], orders);
                        const records = res.Structure.reduce((acc, item) => {
                            const recordId = item.enc_value.RecordNumber.replace(/\s/g, "");
                            const count = acc.reduce((accCount, itemCount) => itemCount === recordId ? accCount + 1 : accCount, 0);
                            if (count === 0) acc.push(recordId);
                            return acc;
                        }, []);
                        this._laboratoryRecords = this._laboratoryRecords.concat(records);
                    })
                        .catch((e) => {
                            console.log(e);
                        });
                    return i;
                });
            });
    });

    checkLaboratoryAndGetAgreement = action((patient) => {
        this.isLoading = true;
        if (this._laboratoryRecords.length > 0) {
            this.deleteLaboratoryServices(this._laboratoryRecords).then(result => result);
            this._laboratoryRecords = [];
        }
        return new Promise((resolve) => {
            if (this.laboratoryCount > 0) {
                this.recordLaboratory(patient).then((data) => data)
                    .then((data) => {
                        return this.getAgreement(this._basketNumber);
                    })
                    .then(data => {
                        this.isLoading = false;
                        resolve(data);
                    });
            } else {
                return this.getAgreement(this._basketNumber).then(data => resolve(data));
            }
        });
    });

    clearBasket = action(() => {
        this._paymentNumber = this._basketNumber;
        this._basketNumber = 0;
        this._basket = [];
    });

    deleteLaboratoryServices = action((records) => {
        let recordsPromise = records.map((item) => {
            const url = `${config.baseUrl}/remove-record` +
                `?recordId=${encodeURIComponent(item)}`;
            return fetchJsonp(url, {timeout: 8000});
        });
        return Promise.all(recordsPromise)
            .then(response => {
                return response.map(item => item.json());
            })
            .then(r => {
                r.map(i => {
                    return i;
                });
                return r;
            });

    });

    isSecondConsultation = action((patient, serviceId, doctorId, dateTime) => {
        this.isLoading = true;
        let url = `${config.baseUrl}/is-second-consultation` +
            `?surname=${encodeURIComponent(patient.lastname)}` +
            `&name=${encodeURIComponent(patient.firstname)}` +
            `&patronymic=${encodeURIComponent(patient.patronymic)}` +
            `&phone=${encodeURIComponent(patient.phone)}` +
            `&email=${encodeURIComponent(patient.email)}` +
            `&birthDate=${encodeURIComponent(patient.bDate)}` +
            `&productId=${encodeURIComponent(serviceId)}` +
            `&specId=${encodeURIComponent(doctorId)}` +
            `&UTCDateTime=${encodeURIComponent(dateTime)}`;

        return fetch(url).then((response) => {
            const result = response.json();
            this.isLoading = false;
            return result
        })
            .catch((error) => {
                this.setError(true, 'Не удалось выполнить запрос. Попробуйте повторить попытку.', false);
                this.isLoading = false;
            });
    });

    getLaboratoryCabinet = action((serviceId) => {
        this.isLoading = true;
        let url = `${config.baseUrl}/get-laboratory-cabinet` +
            `?id=${encodeURIComponent(serviceId)}`;
        return fetch(url).then((response) => response.json())
            .catch((error) => {
                this.setError(true, 'Не удалось выполнить запрос. Попробуйте повторить попытку.', false);
                console.log('err in fetch get-laboratory-cabinet. Error =', error);
            })
            .then(() => this.isLoading = false);
    });

    getWorkingCalendar = action(() => {
        this.isLoading = true;
        if (this._workingCalendar.loaded) {
            this.isLoading = false;
            return this._workingCalendar;
        }
        let url = `${config.baseUrl}/get-working-calendar`;
        return fetch(url).then((response) => response.json())
            .then(data => {
                this._workingCalendar = {
                    loaded: true,
                    data: data
                };
                return this._workingCalendar;
            })
            .catch((error) => {
                console.log('err in fetch get-working-calendar. Error =', error);
            })
            .then(() => this.isLoading = false);
    });

    isSecondInTheBasket = action((item) => {
        let inTheBasket = false;
        if (item.isReconsult) {
            if (this._basket.length > 0) {
                this._basket.forEach(function (record) {
                    if (Number(item.primaryCode) === Number(record.serviceId)) {
                        inTheBasket = true;
                    }
                });
                return inTheBasket
            } else {
                return false;
            }
        } else {
            return false
        }

    });

    checkForRejectLaboratory = action((listIdLabs, curOrders) => {
        let labs = this._basket.filter((item) => item.type === "laboratory");
        labs.forEach((e) => {
            if (curOrders.some(elem => elem.codes.indexOf(e.id) !== -1) &&
                listIdLabs.some(el => (el.ServiceKod === e.id))) {
                e.message = '';
            }
        });
    });

    getTimeForLaboratory = action((getService, codes, date) => {
        const isSat = parseInt(moment(date).format('e')) === 5;
        const time = codes.map((item) => getService(item))
            .map(item => isSat ? [item.lhTimeS, item.lhTimeE] : [item.lTimeS, item.lTimeE])
            .reduce((acc, item) =>
                    [moment.max(moment(item[0], 'HH:mm:ss'), moment(acc[0], 'HH:mm:ss')).format('HH:mm:ss'),
                        moment(item[1], 'HH:mm:ss').hours() ?
                            moment.min(moment(item[1], 'HH:mm:ss'), moment(acc[1], 'HH:mm:ss')).format('HH:mm:ss') : acc[1]],
                isSat ? ["07:30:00", "12:00:00"] : ["07:30:00", "17:00:00"])
            .map(item => moment(item, 'HH:mm:ss').format('HH:mm'));
        const services1 = codes.map((item) => getService(item))
            .map(item => isSat ? [item.lhTimeS, item.lhTimeE] : [item.lTimeS, item.lTimeE])

        return 'c ' + time[0] + ' до ' + time[1];
    })

    recordingLaboratoryGroup = action((codes, date, timeRecord, patient, basket, group, changeDataInSubBasket) => {
        this.isLoading = true;
        return this.removeGroupFromBasket(group, codes, (...obj) => changeDataInSubBasket(...obj), false)
            .then(removeData => {
                let url = `${config.baseUrl}/laboratory-record-get` +
                    `?surname=${encodeURIComponent(patient.lastname)}` +
                    `&name=${encodeURIComponent(patient.firstname)}` +
                    `&patronymic=${encodeURIComponent(patient.patronymic)}` +
                    `&phone=${encodeURIComponent(patient.phone)}` +
                    `&email=${encodeURIComponent(patient.email)}` +
                    `&birthDate=${encodeURIComponent(patient.bDate)}` +
                    `&productsId=${encodeURIComponent(codes)}` +
                    `&address=${patient.patientAddress ? encodeURIComponent(patient.patientAddress) : ''}` +
                    `&addressFact=${patient.patientAddressFact ? encodeURIComponent(patient.patientAddressFact) : ''}` +
                    `&clinic=${patient.patientClinic ? encodeURIComponent(patient.patientClinic) : ''}` +
                    `&documentType=${patient.patientDocumentType ? encodeURIComponent(patient.patientDocumentType) : ''}` +
                    `&documentIdentifier=${patient.patientDocumentIdentifier ? encodeURIComponent(patient.patientDocumentIdentifier) : ''}` +
                    `&documentSeries=${patient.patientDocumentSeries ? encodeURIComponent(patient.patientDocumentSeries) : ''}` +
                    `&UTCDateTime=${encodeURIComponent(date.toJSON())}`;

                if (this._basketNumber > 0) {
                    url += `&basket=${encodeURIComponent(this._basketNumber)}`;
                }
                fetchJsonp(url, {timeout: 8000})
                    .then(response => response.json())
                    .then((data) => {
                            if (data.Sum === '0' || !data.Result) {
                                this.setError(true, 'Не удалось записаться. Попробуйте выбрать другие услуги.', true);
                            } else {
                                const codes = data.Structure.length === undefined ?
                                    [data.Structure.enc_value.ServiceKod] :
                                    data.Structure.map(item => item.enc_value.ServiceKod);
                                let orderId = data.OrderNumber.replace(/\s/g, '');
                                if (!orderId) {
                                    orderId = data.Structure.length === undefined ?
                                        data.Structure.enc_value.RecordNumber :
                                        data.Structure.reduce((acc, item) => item.enc_value.RecordNumber, 0);
                                }
                                if (QuestionnaireStore.currentQuestionnaireType === QuestionnaireStore.QUESTIONNAIRE_TYPE_COVID) {
                                    fetch(`${config.baseUrl}/get-questionnaire`, {
                                        method: 'POST',
                                        cache: 'no-cache',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({orderId})
                                    }).then(r => r.json()).then(async (base64data) => {
                                        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE workaround
                                            const byteCharacters = atob(base64data);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], {type: 'application/pdf'});
                                            window.navigator.msSaveOrOpenBlob(blob, 'order number 123');
                                        } else {
                                            const win = window.open();
                                            const title = `Номер заказа ${orderId}`;
                                            win.document.write(`<iframe title="${title}" src="data:application/pdf;base64, ${base64data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                            win.document.title = title;
                                            win.document.close();
                                        }
                                    }).catch((e) => {
                                        console.log('ERROR', e);
                                    });
                                }
                                const record = {
                                    id: orderId.replace(/\s/g, ''),
                                    serviceId: codes,
                                    doctorId: '',
                                    dateTime: date,
                                    type: 'group',
                                    price: data.Sum,
                                    specialist: '',
                                    cabinet: data.Cabinet,
                                    date: date,
                                    place: '',
                                    time: timeRecord,
                                    patient: patient,
                                    service: group,
                                    message: '',
                                    secondInTheBasket: false,
                                };
                                this.setRecord(record);
                                changeDataInSubBasket(group, true, codes, date, timeRecord, data.Cabinet);

                            }
                            return data;
                        }
                    )
                    .catch((error) => {
                        this.setError(true, 'Не удалось выполнить запрос. Попробуйте повторить попытку.', false);
                    })
                    .then(() => {
                        this.isLoading = false;
                    });
            });
    });

    removeGroupFromBasket = action((group, codes, changeDataInSubBasket, changeLoading) => {
        if (changeLoading) {
            this.isLoading = true;
        }
        const id = this._basket.reduce((id, item) => item.service === group ? item.id : id, null);
        return new Promise((resolve, reject) => {
            if (id === null) {
                if (changeLoading) {
                    this.isLoading = false;
                }
                resolve(true);
            } else {
                const urlReset = `${config.baseUrl}/remove-record` +
                    `?recordId=${encodeURIComponent(id)}`;
                fetchJsonp(urlReset).then((responseReset) => {
                    return responseReset.json();
                }).then((data) => {
                    if (data.result) {
                        this.deleteFromBasket(id);
                        changeDataInSubBasket(group, false, codes, null);
                    } else {
                        this.setError(true, data.message, true);
                        resolve(data);
                    }
                    if (this._basketNumber === id) {
                        this.resetBasketNumIfNeed();
                    }
                    return resolve(data);
                }).catch((error) => {
                    this.setError(true, error, true);
                    reject(error);
                }).then(() => {
                    if (changeLoading) {
                        this.isLoading = false;
                    }
                });
            }
        })
    });

    filterServiceByGroup = action((services, group, sort) => {
        let filtredServices = services.filter(item => {
            let inGroup = false;
            if (!!item.tags) {
                inGroup = item.tags.reduce((acc, tag) => tag.code === group ? true : acc, false);
            }
            if (inGroup) return item
        });
        return sort(filtredServices, group);
    })

    hasLaboratoryInBascet = action(() => {
        let hasLab = false;
        if (this._basket.length > 0) {
            hasLab = this._basket.reduce((acc, item) => item.type === 'group' ? true : acc, false);
        }
        return hasLab;
    })

    hasInBasket = action((groupCode, code) => {
        let inTheBasket = false

        if (this._basket.length != 0) {
            this._basket.forEach(function (record) {
                if (typeof record.serviceId === 'string') {
                    if (record.serviceId === code) {
                        inTheBasket = true;
                    }
                } else {
                    record.serviceId.forEach(function (item) {
                        if (item === code) {
                            inTheBasket = true;
                        }
                    })
                }

            });
        }
        return inTheBasket
    })
}
