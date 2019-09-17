const { GENESIS_DATA , MINE_RATE} = require('../config');
const cryptoHash = require('../util/crypto-hash');
const hexToBinary = require('hex-to-binary');

class Block
{
    constructor({timestamp,nonce,difficulty,lastHash,hash,data})
    {
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.lastHash = lastHash;
        this.hash = hash
        this.data =  data;
    }

    static genesis()
    {
        return new Block(GENESIS_DATA);
    }

    static mineBlock({lastBlock,data})
    {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock,timestamp});
            hash = cryptoHash(timestamp,nonce,difficulty,lastHash,data)
        }while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            nonce,
            difficulty ,
            lastHash,
            data,
            hash,
        });
    }

    static adjustDifficulty({originalBlock,timestamp})
    {
        const { difficulty } = originalBlock;

        
        if((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;

        return difficulty + 1;
    }
}

module.exports = Block
