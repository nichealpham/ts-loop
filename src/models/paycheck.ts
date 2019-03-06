import { ITransaction } from "../interfaces/transaction.itf";
import { IPaypalItem } from "../interfaces/paypal.itf";

let moment = require('moment');

export default (Paycheck: any) => {

    Paycheck.apiFind = async (ctx: any) => {
        let _userId = ctx.req.userAuthen._id;
        let filter = ctx.req.query.filter ? JSON.parse(ctx.req.query.filter) : { where: {} };
        filter.where._userId = _userId;
        filter.order = 'created DESC';
        return await Paycheck.find(filter);
    }

    Paycheck.apiCreate = async (ctx: any) => {
        let _id = ctx.req.userAuthen._id;

        let transactions = await Paycheck.app.models.Transaction.apiFind(ctx) || [];
        if (!transactions.length) {
            // All transactions is checked - out or paid => return success
            return { 
                message: 'All transactions is currently in a paycheck or had been paid successfully! Thank you.'
            };
        }

        // Convert transaction into paypal item
        let items: IPaypalItem[] = transactions.map((transaction: ITransaction) => {
            let itemCost = Math.floor(transaction.totalCost * 100) / 100;
            return {
                name: transaction._recordId,
                sku: "record",
                price: itemCost.toString(),
                currency: "USD",
                quantity: 1
            };
        });
        let description = `Cassandra service cost for account id ${_id}, created at ${moment().format('MMMM Do YYYY, h:mm:ss a')}`;

        // Make a paycheck
        let payment = await Paycheck.app.models.Paypal.createPayment(items, description).catch((error: Error) => {
            throw new Error(`Create payment failed! Error: ${error.toString()}`);
        });

        // If paycheck success, update all transactions status
        if (payment) {
            transactions.forEach((transaction: any) => {
                transaction.status = 'checkout',
                transaction.save();
            });
        }
        let dataCreate = {
            payment,
            _userId: _id,
            _paypalId: payment.id,
            transactions: transactions.map((transaction: ITransaction) => transaction._id)
        }
        return await Paycheck.create(dataCreate);
    }
}