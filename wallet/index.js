const { STARTING_BALANCE } = require('../config');
const cryptoHash = require('../util/crypto-hash');
const { ec } = require('../util/index');


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
}

new Wallet().sign("foo");

module.exports = Wallet;