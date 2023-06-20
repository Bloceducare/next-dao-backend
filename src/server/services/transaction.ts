import Transaction from "@models/transaction"


export const getTransactions =async ()=>{
    const transactions = await Transaction.find()
    return transactions;
}

export const getTransaction =async (txnId:string)=>{  
    const transaction = await Transaction.findOne({ txnId });
    return transaction;
}