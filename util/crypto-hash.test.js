
const cryptoHash = require('./crypto-hash')

describe('cryptoHash()',()=>{
    it('generates a SHA-256 output',()=>{
        expect(cryptoHash('foo')).toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
    });

    
});