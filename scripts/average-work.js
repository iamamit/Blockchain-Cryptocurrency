const Blockchain = require('../blockchain/blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data: 'initial'});

let prevTimeStamp, nextTimeStamp, nextBlock, timeDiff, average;

const times = [];

for(let i=0; i< 10; i++)
{
    prevTimeStamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    blockchain.addBlock({data:`block${i}`});
    nextBlock = blockchain.chain[blockchain.chain.length - 1];

    nextTimeStamp = nextBlock.timestamp;

    timeDiff = nextTimeStamp - prevTimeStamp;

    times.push(timeDiff);

    average = times.reduce((time,num)=>(time+num))/times.length;

    console.log(`${i} Time to mine block: ${timeDiff}ms Difficulty: ${nextBlock.difficulty} Average time: ${average} `);

}