const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain/blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/index');

const app = express();
app.use(bodyParser.json());
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain,transactionPool});



app.get('/api/blocks',(req,resp)=>{
    resp.json(blockchain.chain);
});

app.post('/api/mine',(req,resp)=>{
    console.log(req.body);
    const { data } = req.body;
    
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    
    resp.redirect('/api/blocks');
});

app.post('/api/transact',(req,res)=>{
    const {amount,recipient} = req.body;
    let transaction  = transactionPool.existingTransaction({inputAddress: wallet.publicKey})

    try {
        if(transaction)
        {transaction.update({senderWallet: wallet,recipient,amount})}
        else
        {
            transaction = wallet.createTransaction({recipient,amount});
        }
        
    } catch (error) {
        return res.status(400).json({type: 'error',message: error.message})
    }
    
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    res.json({transaction})
})

app.get('/api/transaction-pool-map',(req,resp)=>{
    resp.json(transactionPool.transactionMap)
})
const DEFAULT_PORT = 3100;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const synchChain = ()=>{
    request ({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(error,response,body)=>{
            if(!error && response.statusCode === 200)
            {
                const rootChain = JSON.parse(body);
                console.log('replace chain on synch with ',rootChain);
                blockchain.replaceChain(rootChain);
            }
            else
            {
                console.log("error",error);
            }
    });
}

let PEER_PORT;

if(process.env.npm_package_config_port === '3100')
{
    PEER_PORT = DEFAULT_PORT +  Math.ceil(Math.random()*1000);
}



PORT = PEER_PORT || DEFAULT_PORT;

try {
    app.listen(PORT,()=>{console.log(`listening on port ${PORT}`);
    if(PORT!==DEFAULT_PORT)
    {
        synchChain();
    }
    
});
} catch (error) {
    console.log("Port already exists");
}

