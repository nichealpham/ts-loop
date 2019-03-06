export interface ITransaction {
    _id: string,
    _recordId: string,
    _analyticsId: string,
    _userId: string,

    totalCost: number,
    durationCost: number,
    storageCost: number,

    description: string,
    status: string,
    created: Date,
    deleted: Date,
}