const EthCrypto = require('eth-crypto');

class Client {
 
  constructor() {

    this.wallet = EthCrypto.createIdentity();
    this.nonce = 0;
  }

  hash(data) {
    return EthCrypto.hash.keccak256(data);
  }

  sign(data) {
    return EthCrypto.sign(this.wallet.privateKey, this.hash(data));
  }

  verify(signature, messageHash, address) {
    return EthCrypto.recover(signature, messageHash) == address;
  }

  buy(amount) {
    console.log(`Tokens bought: ${amount}`);
  }

  generateTx(type, amount, from, to) {
    var tx = {
      type, amount, from, to, nonce: this.nonce
    }
    var signed_tx = {contents: tx, sig: this.sign(tx)}
    this.nonce += 1
    return signed_tx
  }
}

module.exports = Client;
