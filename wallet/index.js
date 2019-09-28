const { STARTING_BALANCE } = require('../config');
const cryptoHash = require('../util/crypto-hash');
const { ec } = require('../util/index');
const Transaction  = require('../wallet/transaction')


class Wallet{
    constructor()
    {
        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data)
    {
       return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({amount,recipient}){
        if(amount>this.balance)
        {
            throw new Error('Amount exceeds balance')
        }

        return new Transaction({senderWallet: this,recipient,amount})
    }
}

new Wallet().sign("foo");

module.exports = Wallet;