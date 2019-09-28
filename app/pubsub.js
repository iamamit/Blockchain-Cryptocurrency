const redis = require('redis');

const CHANNELS = {
    TEST:'TEST',
    BLOCKCHAIN:'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub
{
    constructor({blockchain,transactionPool}){

        this.transactionPool = transactionPool;
        this.blockchain = blockchain;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriberToChannels();
        this.subscriber.on('message',(channel,message)=>{
            this.handleMessage(channel,message);
        });
    }

    handleMessage(channel,message)
    {
        console.log(`message received. Channel: ${channel} , Message : ${message}.`);

        const parsedMessage = JSON.parse(message);
        if(channel = CHANNELS.BLOCKCHAIN)
        {
            this.blockchain.replaceChain(parsedMessage);
        }
        else if(channel = CHANNELS.TRANSACTION)
        {
            this.blockchain.setTransaction(parsedMessage);
        }
    }

    subscriberToChannels()
    {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        })
    }

    publish({channel,message})
    {
        this.subscriber.unsubscribe(channel,()=>{
            this.publisher.publish(channel,message,()=>{
                this.subscriber.subscribe(channel);
            })
        });
        this.publisher.publish(channel,message);
    }
    broadcastChain()
    {
        this.publish({
            channel : CHANNELS.BLOCKCHAIN,
            message : JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction)
    {
        this.publish({
            channel : CHANNELS.TRANSACTION,
            message : JSON.stringify(transaction)
        })
    }
}



module.exports = PubSub;
