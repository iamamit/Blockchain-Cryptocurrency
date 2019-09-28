const TransactionPool = require('./transaction-pool');
const Wallet = require('./index');
const Transaction = require('./transaction');

describe('TransactionPool()',()=>{
    let senderWallet;
    beforeEach(()=>{
        transactionPool = new TransactionPool()
        transaction = new Transaction({
            senderWallet: new Wallet(),
            recipient: 'fake-recepient',
            amount: 50
        });
    });

    describe('setTransaction()',()=>{
        it('adds a transaction',()=>{
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction)
        })
    })

    describe('validTransaction()',()=>{
        let validTransactions;
        beforeEach(()=>{
            validTransactions = []

            for(let i=0;i<10;i++)
            {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'any-recepient',
                    amount: 50
                })

                if(i%3==0)
                {transaction.input.amount = 999999}
                else if(i%3==1)
                {transaction.input.signature = new Wallet().sign('foo')}
                else{validTransactions.push(transaction)}
            }

            transactionPool.setTransaction(transaction)
        })
        it('return valid transaction',()=>{
            expect(transactionPool.validTransactions()).toEqual(validTransactions)
        })
    })
})