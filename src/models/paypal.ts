import { CommonFunctions } from "../utils/common";
import { IPaypalItem, IPaypalTransaction } from "../interfaces/paypal.itf";

let paypalClient = require('paypal-rest-sdk');
let option = require(`../paypal.${process.env.NODE_ENV === 'dev' ? 'dev' : 'live' }.json`);
let config = require('../config.json');

let baseUrl = `${process.env.NODE_ENV === 'dev' ? `http://localhost` : 'http://35.231.114.91'}:${config.port}${config.restApiRoot}`;
let isConfigured = false;

option.payment.redirect_urls = {
    return_url: `${baseUrl}/paypal/success`,
    cancel_url: `${baseUrl}/paypal/cancel`,
}

export default (Paypal: any) => {

    Paypal.setup = async () => {
        if (!option || !option.client_id || !option.client_secret) {
            return false;
        }
        paypalClient.configure({
            mode: option.mode || 'sandbox', //sandbox or live
            client_id: option.client_id,
            client_secret: option.client_secret
        });
        isConfigured = true;
        return true;
    }

    Paypal.createPayment = async (items: IPaypalItem[], description: string) => {
        if (!isConfigured) {
            if (!await Paypal.setup()) {
                throw CommonFunctions.systemError('PAYPAL_SETUP_FAILED');
            }
        }
        // Calculate total cost of a paycheck
        let totalCost = 0;
        items.forEach(item => totalCost += Number(item.price));

        // Create a payment with only one transaction that stores all items
        let transactions: IPaypalTransaction[] = [
            {
                item_list: {
                    items
                },
                amount: {
                    currency: "USD",
                    total: (Math.floor(totalCost * 100) / 100).toString()
                },
                description
            }
        ];
        let payment = {
            ...option.payment,
            transactions
        };
        return new Promise((resolve, reject) => {
            paypalClient.payment.create(payment, (error: Error, payment: Object) => {
                if (error) {
                    return reject(error);
                } 
                return resolve(payment);
            });
        });
    }

    Paypal.handleSuccess = async (ctx: any) => {
        let payerId = ctx.req.query.PayerID;
        let paymentId = ctx.req.query.paymentId;

        let paycheck = await Paypal.app.models.Paycheck.findOne({
            where: {
                _paypalId: paymentId,
            }
        });

        if (!paycheck) {
            throw CommonFunctions.systemError('PAYCHECK_NOT_EXISTED');
        }
        if (paycheck.status !== 'waiting-approval') {
            throw CommonFunctions.systemError('PAYCHECK_CANNOT_PAID')
        }
        let transactions = paycheck.payment.transactions;

        let data = {
            payer_id: payerId,
            transactions
        }

        return new Promise((resolve) => {
            paypalClient.payment.execute(paymentId, data, async (error: Error, payment: Object) => {
                if (error) {
                    throw new Error(`Execute payment ${paymentId} failed! Error: ${error.toString()}`);
                }
                else {
                    paycheck.status = 'paid';
                    paycheck.payment = payment;
                    await paycheck.save();

                    for (let transactionId of paycheck.transactions) {
                        let transaction = await Paypal.app.models.Transaction.findById(transactionId);
                        if (transaction) {
                            transaction.status = 'paid';
                            await transaction.save();
                        }
                    }
                    // return resolve(ctx.res.redirect(option.console_url));
                    return resolve(paycheck);
                }
            });
        });
    }
};