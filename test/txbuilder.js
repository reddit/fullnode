var should = require('chai').should();
var Txbuilder = require('../lib/txbuilder');
var Tx = require('../lib/tx');
var Txout = require('../lib/txout');
var Address = require('../lib/address');
var BN = require('../lib/bn');
var Interp = require('../lib/interp');
var BR = require('../lib/br');
var Script = require('../lib/script');
var Pubkey = require('../lib/pubkey');
var Privkey = require('../lib/privkey');
var tx_valid = require('./vectors/bitcoind/tx_valid');
var tx_invalid = require('./vectors/bitcoind/tx_invalid');

describe('Txbuilder', function() {
  
  it('should make a new txbuilder', function() {
    var txb = new Txbuilder();
    (txb instanceof Txbuilder).should.equal(true);
    should.exist(txb.tx);
    txb = Txbuilder();
    (txb instanceof Txbuilder).should.equal(true);
    should.exist(txb.tx);
    txb = Txbuilder({
      tx: Tx()
    });
    should.exist(txb.tx);
  });

  describe('#addToAddress', function() {
    
    it('should add a scripthash address', function() {
      var hashbuf = new Buffer(20);
      hashbuf.fill(0);
      var address = Address().fromScript(Script().fromScripthash(hashbuf));
      var txb = Txbuilder();
      txb.addToAddress(BN(0), address);
      txb.tx.txouts.length.should.equal(1);
    });

    it('should add a pubkeyhash address', function() {
      var pubkey = Pubkey().fromPrivkey(Privkey().fromRandom());
      var address = Address().fromPubkey(pubkey);
      var txb = Txbuilder();
      txb.addToAddress(BN(0), address);
      txb.tx.txouts.length.should.equal(1);
    });

  });

  describe('vectors', function() {

    var c = 0;
    tx_valid.forEach(function(vector, i) {
      if (vector.length === 1)
        return;
      c++;
      it('should verify tx_valid vector ' + c, function() {
        var inputs = vector[0];
        var txhex = vector[1];
        var flags = Interp.getFlags(vector[2]);

        var map = {};
        inputs.forEach(function(input) {
          var txoutnum = input[1];
          if (txoutnum === -1)
            txoutnum = 0xffffffff; //bitcoind casts -1 to an unsigned int
          map[input[0] + ":" + txoutnum] = Txout().setScript(Script().fromBitcoindString(input[2]));
        });

        var tx = Tx().fromBuffer(new Buffer(txhex, 'hex'));
        var txb = Txbuilder().set({
          tx: tx,
          prevtxoutsmap: map
        });

        txb.verifytx(flags).should.equal(true);
      });
    });

    var c = 0;
    tx_invalid.forEach(function(vector, i) {
      if (vector.length === 1)
        return;
      c++;
      it('should unverify tx_invalid vector ' + c, function() {
        var inputs = vector[0];
        var txhex = vector[1];
        var flags = Interp.getFlags(vector[2]);

        var map = {};
        inputs.forEach(function(input) {
          var txoutnum = input[1];
          if (txoutnum === -1)
            txoutnum = 0xffffffff; //bitcoind casts -1 to an unsigned int
          map[input[0] + ":" + txoutnum] = Txout().setScript(Script().fromBitcoindString(input[2]));
        });

        var tx = Tx().fromBuffer(new Buffer(txhex, 'hex'));
        var txb = Txbuilder().set({
          tx: tx,
          prevtxoutsmap: map
        });

        txb.verifytx(flags).should.equal(false);
      });
    });

  });

});
