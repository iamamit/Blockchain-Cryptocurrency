const crypto = require('crypto');


const cryptoHash = (...inputs)=>{
    console.log(inputs.join(' '))
    const hash = crypto.createHash('sha256');

    hash.update(inputs.map(input => JSON.stringify(input)).join(' '));

    return hash.digest('hex');
}

module.exports = cryptoHash;