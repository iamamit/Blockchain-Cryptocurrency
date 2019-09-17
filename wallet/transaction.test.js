const Transaction = require('./transaction');
const Wallet = require('./index');
const {verifySignature} = require('../util');

describe('Transaction',()=>{
    let transaction,senderWallet, recipient, amount;

    beforeEach(()=>{
        senderWallet = new Wallet();
        recipient = 'recipient-public-key';
        amount = 50;
        transaction = new Transaction({senderWallet,recipient,amount});
    })

    it('has an `id`',()=>{
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap',()=>{
        it('has an `outputMap`',()=>{
            expect(transaction).toHaveProperty('outputMap');
        })

        it('output the amount to the recipient',()=>{
            expect(transaction.outputMap[recipient]).toEqual(amount);
        })

        it('output the remaining balance for the `senderWallet`',()=>{
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        })
    })

    describe('input',()=>{
        it('has an `input`',()=>{
            expect(transaction).toHaveProperty('input');
        })

        it('has an `timestamp`',()=>{
            expect(transaction.input).toHaveProperty('timestamp');
        })

        it('set the `amount` to the `senderWallet` balance',()=>{
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        })

        it('set the `address` to the `senderWallet` publicKey',()=>{
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        })

        it('sign the input',()=>{
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature:transaction.input.signature
                })
            ).toBe(true);
        })


    })

    describe('valid transaction',()=>{
        describe('when the transaction is valid',()=>{
            it('return true',()=>{
                expect(Transaction.validTransaction(transaction)).toBe(true);
            })
        });
        describe('when the transaction is invalid',()=>{
            describe('and transaction outputMap value is invalid',()=>{
                it('returns false',()=>{
                    transaction.outputMap[senderWallet.publicKey] = 99999;

                    expect(Transaction.validTransaction(transaction)).toBe(false);
                })
            })
           
        });
        describe('and the transaction input signature is invalid',()=>{
            it('return false',()=>{
                transaction.input.signature = new Wallet().sign('data');

                expect(Transaction.validTransaction(transaction)).toBe(false);
            })
        });
        
    })
})