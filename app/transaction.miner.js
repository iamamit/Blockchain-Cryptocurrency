class TransactionMiner
{
    constructor({blockchain,transactionPool,wallet,pubsub})
    {
        this.blockchain = blockchain
        this.transactionPool = transactionPool
        this.wallet = wallet
        this.pubsub = pubsub
    }

    mineTransaction()
    {
        // Grt the transaction pool's valid transactions

        //generate the miner's reward

        //and a block consisiting of these transactions to the blockchain

        // broadcast the updated blockchain

        //clear the pool
    }
}

module.exports = TransactionMiner