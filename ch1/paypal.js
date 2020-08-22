const EthCrypto = require('eth-crypto');
const Client = require('./client.js');

// Our naive implementation of a centralized payment processor
class Paypal extends Client {
  constructor() {
    super();

    this.state = {
      [this.wallet.address]: {
        balance: 1000000,
        nonce: this.nonce
      },
    };

    this.txHistory = [];

    this.pendingTxPool = [];

    this.networkFee = 1;

    this.addressBlacklist = [];
  }

  checkTxSignature(tx) {
    return this.verify(tx.sig, this.hash(tx.contents), tx.contents.from)
  }

  checkUserAddress(tx) {
    if (this.addressBlacklist.includes(tx.contents.from) || this.addressBlacklist.includes(tx.contents.to)) {
      return false;
    } else {
      if (this.state[tx.contents.from] == undefined) {
        this.state[tx.contents.from] = {balance: 0, nonce: 0};
      }
      if (this.state[tx.contents.to] == undefined) {
        this.state[tx.contents.to] = {balance: 0, nonce: 0};
      }
      return true;
    }
  }

  checkTxType(tx) {
   
    if (tx.contents.type == "mint" && tx.contents.from == this.wallet.address) {
      return true;
    } else if (tx.contents.type == "check") {
      console.log(this.state[tx.contents.from].balance);
      return false;
    } else if (tx.contents.type == "send" && this.state[tx.contents.from].balance >= tx.contents.amount && tx.contents.amount > 0) {
      return true;
    } else if (tx.contents.type == "cancel") {
      for (var i=0; i<this.pendingTxPool.length; i++) {
        if (tx.contents.amount == this.pendingTxPool[i].contents.nonce && tx.contents.from == this.pendingTxPool[i].contents.from) {
          this.pendingTxPool.splice(i, 1);
          break;
        }
      }
      for (var i=0; i<this.txHistory.length; i++) {
        if (tx.contents.amount == this.txHistory[i].contents.nonce && tx.contents.from == this.txHistory[i].contents.from) {
          this.state[this.txHistory[i].contents.from].balance += this.txHistory[i].contents.amount
          this.state[this.txHistory[i].contents.to].balance -= this.txHistory[i].contents.amount
          this.txHistory.splice(i, 1);
          break;
        }
      }
      this.txHistory.push(tx);
      this.state[this.wallet.address].balance += 1;
      this.state[tx.contents.from].balance -= 1;
    } else {
      console.log("error: ", this.state[tx.contents.from].balance, tx.contents.amount==0);
      return false;
    }
  }

  checkTx(tx) {
    return (this.checkTxSignature(tx) && this.checkUserAddress(tx) && this.checkTxType(tx))
  }

  applyTx(tx) {
    this.state[tx.contents.from].balance -= tx.contents.amount;
    this.state[tx.contents.to].balance += tx.contents.amount;
    this.state[tx.contents.from].nonce += 1;
    this.txHistory.push(tx);
    return true;
  }

  processTx(tx) {
    this.chargeFee(tx);
    if (this.checkTx(tx)) {
      this.applyTx(tx);
      this.processPendingTx();
      return true;
    } else {
      return false;
    }
  }

  checkTxNonce(tx) {
    if (this.state[tx.contents.from] != undefined) {
      if (tx.contents.nonce > this.state[tx.contents.from].nonce) {
        if (!this.pendingTxPool.includes(tx)) {
          this.pendingTxPool.push(tx);
        } else {
          return false;
        }
      } else if (tx.contents.nonce == this.state[tx.contents.from].nonce) {
        return true;
      } else {
        return false;
      }
    } 
  }

  processPendingTx() {
    for (var i=0; i<this.pendingTxPool.length; i) {
      if (this.pendingTxPool[i].contents.nonce == this.state[this.pendingTxPool[i].contents.from].nonce) {
        processTx(this.pendingTxPool.shift())
      }
    }
  }

  chargeFee(tx) {
    tx.contents.amount -=1;
    this.state[this.wallet.address].balance += 1;
  }

  stealAllFunds() {
    for (const account in this.state) {
      if (account != this.wallet.address) {
        this.state[this.wallet.address].balance += this.state[account].balance;
        this.state[account].balance =0;
      }
    }
  }

  mintSecretFunds() {
    this.state[this.wallet.address].balance += 1000000;
  }

}

module.exports = Paypal;
