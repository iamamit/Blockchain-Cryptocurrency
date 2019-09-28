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

    describe('update()',()=>{
        let originalSignature,originalSenderOutput,nextRecipient, nextAmount;
        describe('and the amount is invalid',()=>{
            it('throws an error',()=>{
                expect(()=>{
                    transaction.update({senderWallet,recipient: 'foo',amount: 999999})
                }).toThrow('Amount exceed balance')
            })
        })
        beforeEach(()=>{
            originalSignature = transaction.input.signature;
            originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
            nextRecipient = 'next-recipient';
            nextAmount = 50;

            transaction.update({senderWallet,recipient: nextRecipient,amount: nextAmount});
        })
        it('output the amount to the next recipient',()=>{
            expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
        });

        it('substract the amounts from original sender output amount',()=>{
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput-nextAmount);
        });

        it('maintains a total output that matches the input amount',()=>{
            expect(Object.values(transaction.outputMap).reduce((total,outputAmount)=>total+outputAmount)).toEqual(transaction.input.amount)
            
        });

        it('re-sign the transaction',()=>{
            expect(transaction.input.signature).not.toEqual(originalSignature)
        });
        
        describe('and another amount for same recipient',()=>{
            let addedAmount = 80;
            beforeEach(()=>{
                addedAmount = 80;
                transaction.update({senderWallet,recipient: nextRecipient,amount: addedAmount});
            })

            // it('adds the recepient amount',()=>{
                
            //     expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount+addedAmount);
            // });

            it('subtract the amount from the original sender output amount',()=>{
                expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput-nextAmount-addedAmount);
            })
        })
    })
})