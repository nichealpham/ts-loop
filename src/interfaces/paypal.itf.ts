export interface IPaypalItem {
    name: string,
    sku: string,
    price: string,
    currency: string,
    quantity: number,
}

export interface IPaypalItemList {
    items: IPaypalItem[],
}

interface IPaypalTransactionAmount {
    currency: string,
    total: string,
}

export interface IPaypalTransaction {
    item_list: IPaypalItemList,
    amount: IPaypalTransactionAmount,
    description: string,
}



