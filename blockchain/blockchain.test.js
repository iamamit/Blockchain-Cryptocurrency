const Blockchain = require('./blockchain');
const Block = require('./block');


describe('Blockchain',()=>{
    let blockchain, newChain, originalChain;

    beforeEach(()=>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    it('contains instance of an array',()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('should be start with a genesis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain',()=>{
        const newData = 'foo bar';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    })

    describe('isValidChain()',()=>{
        describe('when the chain does not start with genesis block',()=>{
            it('return false',()=>{
                blockchain.chain[0] = {data: 'fake-genesis'} 
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            })
        })
    });

    describe('when the chain start with genesis block and has multiple blocks',()=>{

        beforeEach(()=>{
            blockchain.addBlock({data:'A'});
            blockchain.addBlock({data:'B'});
            blockchain.addBlock({data:'C'});
        });

        describe('and a lastHash reference has changed ',()=>{
            it('return False',()=>{
                

                blockchain.chain[0].lastHash = 'broken-lastHash';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('and has an invalid field ',()=>{
            it('return False',()=>{

                blockchain.chain[0].data = 'bad-data';
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('and the chain does not contain invalid chain ',()=>{
            it('return False',()=>{
                
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
            });
        });
    });

    describe('replaceChain()',()=>{
        let error,log;
        beforeEach(()=>{
            error = jest.fn();
            log = jest.fn();

            global.console.error = error;
            global.console.log = log
        });

        describe('when the new chain is not longer',()=>{
            it('does not replace the chain',()=>{
                newChain.chain[0] = {new:'chain'};
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            })
        });

        describe('when the new chain is longer',()=>{
            beforeEach(()=>{
                newChain.addBlock({data:'A'});
                newChain.addBlock({data:'B'});
                newChain.addBlock({data:'C'});
            });
            describe('and the chain is invalid',()=>{
                it('does not replace the chain',()=>{
                    newChain.chain[2].hash = 'fake-hash';
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe('and the chain is valid',()=>{
                it('replace the chain',()=>{
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
            
        });

        describe('when the new chain is not longer',()=>{
            it('does not replace the chain',()=>{
                
            })
        });
    });

});