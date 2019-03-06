import { ITransaction } from "../interfaces/transaction.itf";

export default (Cost: any) => {
    Cost.getServiceCost = async (ctx: any): Promise<{cost: number}> => {
        let _id = ctx.req.userAuthen._id;
        let transactions : ITransaction[] = await Cost.app.models.Transaction.find({
            where: {
                _userId: _id,
                status: 'payable'
            }
        });
        let cost = 0;
        transactions.forEach(transaction => {
            cost += transaction.totalCost
        });
        return {
            cost
        };
    }
}