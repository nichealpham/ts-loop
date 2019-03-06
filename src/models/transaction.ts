import { CommonFunctions } from "../utils/common";
import { ITransaction } from "../interfaces/transaction.itf";

export default (Transaction: any) => {

    Transaction.apiFind = async(ctx: any): Promise<ITransaction[]> => {
        let _id = ctx.req.userAuthen._id;
        let filter = ctx.req.query.filter ? JSON.parse(ctx.req.query.filter) : { where: { status: 'payable' } };
        filter.where._userId = _id;
        filter.order = 'created DESC';
        return await Transaction.find(filter);
    }

    Transaction.apiCreate = async(ctx: any): Promise<ITransaction> => {
        let _id = ctx.req.userAuthen._id;

        let pricing = await Transaction.app.models.Pricing.getCurrentPricing();
        let analytics = ctx.req.body;

        let storageCost = pricing.STORAGE.VALUE * analytics.fileSize / pricing.STORAGE.UNIT;
        let durationCost = pricing.DURATION.VALUE * analytics.signalDuration / pricing.DURATION.UNIT;

        let description = `Service cost for record ${ctx.req.body._recordId}, analyzing duration is ${analytics.signalDuration}s and file size is ${CommonFunctions.convert2HumanFileSize(analytics.fileSize)}.`;
        
        let totalCost = Math.round((storageCost + durationCost) * 1000) / 1000;
        let dataCreate = {
            _recordId: ctx.req.body._recordId,
            _analyticsId: ctx.req.body._id,
            _userId: _id,
            totalCost,
            storageCost,
            durationCost,
            description,
            created: new Date(),
        }
        return await Transaction.create(dataCreate);
    }
}