const Transaction = require('../wallet/transaction')

class TransactionPool
{
    constructor()
    {
        this.transactionMap = {}
    }

    setTransaction(transaction)
    {
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({ inputAddress }){
        const transaction = Object.values(this.transactionMap);

        return transaction.find(transaction=> transaction.input.address == inputAddress)
    }

    validTransactions()
    {
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        )
    }
}

module.exports = TransactionPool