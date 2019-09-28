const Wallet = require('./index');
const { verifySignature } = require('../util/index');
const Transaction = require('./transaction')

describe('Wallet',()=>{
    let wallet;

    beforeEach(()=>{
        wallet = new Wallet();
    });

    it('has a `balance`',()=>{
        expect(wallet).toHaveProperty('balance');
    })

    it('has a `public key`',()=>{
        console.log(wallet.publicKey);
        expect(wallet).toHaveProperty('publicKey');
    })

    describe('signing data',()=>{
         const data = 'foo';

         it('verify a signature',()=>{
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature:wallet.sign(data) 
                })
            ).toBe(true);
         });

         it('does not verify an invalid signature',()=>{
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature:new Wallet().sign(data) 
                })
            ).toBe(false);
         })
    })

    describe('createTransaction()',()=>{
        // beforeEach(()=>{
        //     wallet = new Wallet();
        // });

        describe('and the amount exceed the balance',()=>{
            it('throws an error',()=>{
                expect(()=>wallet.createTransaction({amount: 99999,recipient: 'foo-recipient'})).toThrow('Amount exceeds balance');
            })
            
        });

        describe('and the amount is valid',()=>{
            let transaction,amount,recipient;
            beforeEach(()=>{
                amount = 50;
                recipient = 'foo-recipient';
                transaction = wallet.createTransaction({amount,recipient})
            })
            it('create an instance of `Transaction`',()=>{
                expect(transaction instanceof Transaction).toBe(true)
            });

            it('matches the transaction input with wallet', ()=>{
                expect(transaction.input.address).toEqual(wallet.publicKey);
            })

            it('output the amount of recipient',()=>{
                expect(transaction.outputMap[recipient]).toEqual(amount)
            })
        });
    })
})