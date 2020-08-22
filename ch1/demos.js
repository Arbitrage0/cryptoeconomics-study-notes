const EthCrypto = require('eth-crypto');
const Client = require('./client.js');
const Paypal = require('./paypal.js');

console.log('/////////////////////////////////////');
console.log('// Hashing and Public/Private Keys //');
console.log('/////////////////////////////////////');

// Hashing A Message
console.log("\nLet's hash a message!");
const message = 'Hello World';
console.log('The message is: ', message);
const messageHash = EthCrypto.hash.keccak256(message)
console.log('The hash of that message is: ', messageHash)

// Creating Public/Private Keys
console.log('\nCreating public/private key pairs to sign and verify messages.')

// Init Alice
const alice = new Client;
console.log('Init Alice\'s Client\n', alice)

// Init Bob
const bob = new Client;
console.log('Init Bob\'s Client\n', bob)

// Notes
console.log('Notice that on their own Alice, Bob, and Carol just have keys. In order to have accounts that can hold tokens they need to connect to a network. The Paypal network is one such network, but Bitcoin and Ethereum are also networks. The state of the network is what determines account balances, so how the network operates is very important to users.')
console.log('Btw, you might notice that the public key is different than the address. This is because Ethereum addresses are generated from public, but are not exactly the same thing. Here\'s more info on that process: https://ethereum.stackexchange.com/questions/3542/how-are-ethereum-addresses-generated/3619#3619')

// Signing Messages
console.log('\nSigning Messages')
const messageFromAlice = 'My name is Alice'
console.log('Alice\'s message: ', messageFromAlice)
const hashedMessageFromAlice = alice.hash(messageFromAlice)
console.log('Now Alice has hashed her message:', hashedMessageFromAlice)
const signedMessageFromAlice = alice.sign(messageFromAlice)
console.log('Alice\'s message signature: ', signedMessageFromAlice)

// Verifying Messages
console.log('\nLet\'s help Bob verify Alice\'s message')
console.log('To do this we need to verify the message signature and the message hash to see if they return Alice\'s address')
const isMessageFromAliceAuthentic = alice.verify(signedMessageFromAlice, hashedMessageFromAlice, alice.wallet.address)
console.log('Is the message authentic?')
console.log(isMessageFromAliceAuthentic)

// Note
console.log('\nWhile this may seem like a silly example, message signing and verification allows us to securely connect to websites, download files from servers, and run any public blockchain network!\n')

console.log('/////////////////////////////////');
console.log('// Initial Paypal Network Demo //');
console.log('/////////////////////////////////');

// Setup Paypal network
const paypal = new Paypal();
console.log(paypal);

// Generate transaction
const aliceTx = alice.generateTx('send', 10, alice.wallet.address, bob.wallet.address);
console.log('\nAlice sends a TX to Bob via the Paypal network\n', aliceTx);

// Check transaction signature
const checkAliceTx = paypal.checkTxSignature(aliceTx);
console.log("\nPaypal checks Alice's transaction to Bob. Is it valid?");
console.log(checkAliceTx);

// Check user address
paypal.checkUserAddress(aliceTx);
console.log(
  "\nPaypal checks if Alice and Bob have already opened accounts with Paypal. They have not, so Paypal adds their addresses to it's state\n",
  paypal,
);

// Check transaction type
console.log(
  "\nNow that Alice and Bob's addresses are in the Paypal network, Paypal checks to make sure that the transaction is valid. ",
);
console.log('Is it? ');
const checkAliceTxType = paypal.checkTxType(aliceTx);
console.log(
  'Alice has a balance of 0, but the transaction is trying to spend 10. In order to send tokens on the Paypal network Alice is going to have to have to buy them from Paypal Inc.',
);
console.log(
  "Alice really wants to use Paypal's network so she sells her right kidney and gets enough money to buy 100 of Paypal's magic tokens. Now Alice can finally participate in the network!",
);
alice.buy(100);
const mintAlice100Tokens = paypal.generateTx('mint', 100, paypal.wallet.address, alice.wallet.address);
paypal.processTx(mintAlice100Tokens);
console.log(paypal);

// Check user balance
console.log('\nAlice checks her balance with Paypal');
const checkAliceAccountBalance = alice.generateTx(
  'check', 0, alice.wallet.address,
);
paypal.checkTxType(checkAliceAccountBalance);

// Note
console.log(
  '\n// Notice that all Alice can do is send a message to the network and ask what her balance is. With a central operator Alice is trusting that the balance that she is told (and the balance in the database) is accurate. With a public blockchain like Bitcoin or Ethereum Alice can see the entire history of the network and verify transactions herself to make sure that everything is accurate.',
);

// Sending Tokens
console.log(
  '\nNow that Alice has verified that she has some tokens she wants to pay Bob back for the gallon of Ketchup he gave her. To do this Alice sends a transaction on the Paypal network',
);
const payBobBackForKetchup = alice.generateTx('send', 55, alice.wallet.address, bob.wallet.address);
console.log(payBobBackForKetchup);
console.log('\nPaypal sees this transaction and processes it.');
paypal.processTx(payBobBackForKetchup);
console.log(paypal);

console.log(
  '\nYay! Now Bob has been made whole, Paypal sold some of their magic tokens, and Alice gets to live life on the edge with only one kidney. Everyone wins :)',
);
console.log('');

const EthCrypto = require('eth-crypto');
const Client = require('./client.js');
const Paypal = require('./paypal.js');

// Paypal Network Demo
console.log('//////////////////////////////////');
console.log('// Paypal Network Demo w Nonces //');
console.log('//////////////////////////////////');

// Setup Paypal network
const paypal = new Paypal();
console.log('\nInitial Paypal network:');
console.log(paypal);

// Mint tokens for our users
console.log(
  '\nToday Paypal has a promotion that new users get 100 free tokens for signing up',
);

// Alice signs up for Paypal
const alice = new Client();
const newUserAlice = paypal.generateTx('mint', 100, paypal.wallet.address, alice.wallet.address);
paypal.processTx(newUserAlice);

// Bob signs up for Paypal
const bob = new Client();
const newUserBob = paypal.generateTx('mint', 100, paypal.wallet.address, bob.wallet.address);
paypal.processTx(newUserBob);

// Carol signs up for Paypal
const carol = new Client();
const newUserCarol = paypal.generateTx('mint', 100, paypal.wallet.address, carol.wallet.address);
paypal.processTx(newUserCarol);

// Paypal's first users
console.log(
  "\nLet's look at the state of Paypal's network now that there are a few users:",
);
console.log(paypal);

// Generate transaction
const aliceTx = alice.generateTx('send', 10, alice.wallet.address, bob.wallet.address);
console.log('\nAlice generates a transaction to send 10 tokens to Bob.');
console.log(aliceTx);

// Mandatory waiting period, because... YOLO
console.log('\nPaypal does not process the transaction right away...');

// Generating another transaction
console.log(
  '\nAlice gets impatient and submits the transaction again, because clicking things is more satisfying than waiting.',
);
const aliceTx2 = alice.generateTx('send', 10, alice.wallet.address, bob.wallet.address);
console.log(aliceTx2);

// Paypal gets the transactions
paypal.processTx(aliceTx2);
console.log(
  "\nDue to a network error, Paypal gets Alice's second transaction first and it goes in the pendingTx pool",
);
console.log(paypal);
paypal.processTx(aliceTx);
console.log(
  "\nPaypal then gets Alice's first transaction, processes it, and then processes any transactions in the pendingTx pool",
);
console.log(paypal);

// SNAFU
console.log(
  '\nOh no! Alice has actually sent Bob 20 tokens instead of the 10 she intended. What to do...',
);
console.log(
  "Lucky for Alice, Paypal has a cancel transaction feature. Yes that's right! Alice can cancel her transaction, for a small fee of course...",
);
console.log(
  'Since the fee is smaller than the extra 10 tokens Alice sent, she sends a cancellation transaction to Paypal and gets her tokens back',
);
// note: nonces are zero indexed, so they start at 0, then 1, then 2, etc...
const aliceTx2Cancellation = alice.generateTx('cancel', 0, alice.wallet.address, paypal.wallet.address);
paypal.processTx(aliceTx2Cancellation);

// All's well that ends well
console.log(
  "\nNow let's look at Paypal's state to see everyone's accounts and balances",
);
console.log(paypal);

// Feature or bug? You decide!
console.log(
  "note that when you're using a centralized payment processor's database, they set the rules and can manipulate the state arbitrarily. This can be good if you're worried about regulatory compliance or the ability to revert errors, but it also means that there are no guarantees that your account, funds, or transactions are valid. With decentralized networks like Bitcoin and Ethereum transactions are immutable and no one can stop them, not even you. Feature or bug? You decide!",
);

const EthCrypto = require('eth-crypto');
const Client = require('./client.js');
const Paypal = require('./paypal.js');

// Paypal Network Demo
console.log('///////////////////////////////////////////');
console.log('// Paypal Network Demo w Rent Extraction //');
console.log('///////////////////////////////////////////');

// Setup Paypal network
const paypal = new Paypal();
console.log('\nInitial Paypal network:');
console.log(paypal);

// Mint tokens for our users
console.log(
  '\nToday Paypal has a promotion that new users get 100 free tokens for signing up',
);

// Alice signs up for Paypal
const alice = new Client();
const newUserAlice = paypal.generateTx('mint', 1000, paypal.wallet.address, alice.wallet.address);
paypal.processTx(newUserAlice);

// Bob signs up for Paypal
const bob = new Client();
const newUserBob = paypal.generateTx('mint', 1000, paypal.wallet.address, bob.wallet.address);
paypal.processTx(newUserBob);

// Carol signs up for Paypal
const carol = new Client();
const newUserCarol = paypal.generateTx('mint', 1000, paypal.wallet.address, carol.wallet.address);
paypal.processTx(newUserCarol);

// Dave signs up for Paypal
const dave = new Client();
const newUserDave = paypal.generateTx('mint', 1000, paypal.wallet.address, dave.wallet.address);
paypal.processTx(newUserDave);

// Earl signs up for Paypal
const eve = new Client();
const newUserEve = paypal.generateTx('mint', 1000, paypal.wallet.address, eve.wallet.address);
paypal.processTx(newUserEve);

// Frank signs up for Paypal
const frank = new Client();
const newUserFrank = paypal.generateTx('mint', 1000, paypal.wallet.address, frank.wallet.address);
paypal.processTx(newUserFrank);

// George signs up for Paypal
const george = new Client();
const newUserGeorge = paypal.generateTx('mint', 1000, paypal.wallet.address, george.wallet.address);
paypal.processTx(newUserGeorge);

// Harry signs up for Paypal
const harry = new Client();
const newUserHarry = paypal.generateTx('mint', 1000, paypal.wallet.address, harry.wallet.address);
paypal.processTx(newUserHarry);

// Ian signs up for Paypal
const ian = new Client();
const newUserIan = paypal.generateTx('mint', 1000, paypal.wallet.address, ian.wallet.address);
paypal.processTx(newUserIan);

// Jill signs up for Paypal
const jill = new Client();
const newUserJill = paypal.generateTx('mint', 1000, paypal.wallet.address, jill.wallet.address);
paypal.processTx(newUserJill);

// Paypal's first users
console.log(
  "\nLet's look at the state of Paypal's network now that there are a few users:",
);
console.log(paypal);

// The only constant is change
console.log(
  "\nLet's imagine that some time has passed... Paypal is doing well and has lots of users. Naturally, Paypal decides to implement fees. Users are already using Paypal and don't want to switch, so the fee isn't THAT big of a deal. Let's see how it affects their balances over time",
);

// Death by 1000 transaction fees
function financialAttrition(...users) {
  // 1000 transactions
  for (let i = 0; i < 1000; i++) {
    // pick a random value between 2 and 10 (because of fees)
    var txValue = Math.floor(Math.random() * 10)+2;
    // choose two users at random, but excluding Paypal
    var user1 = users[Math.floor(Math.random() * users.length)];
    var user2 = users[Math.floor(Math.random() * users.length)];
    // create a transaction from one random user to another
    var tx = user1.generateTx('send', txValue, user1.wallet.address, user2.wallet.address);
    // process the transaction
    paypal.processTx(tx);
    // print the state to the console every 100 iterations so we can see the progress
    if (i % 100 === 0) {
      console.log('\nITER: ', i);
      console.log(
        "Paypal's balance: ",
        paypal.state[paypal.wallet.address].balance,
      );
      // uncomment if you want to view the full state
      // console.log(paypal);
    }
  }
}

financialAttrition(
  alice,
  bob,
  carol,
  dave,
  eve,
  frank,
  george,
  harry,
  ian,
  jill,
);

// The truth will set you free
console.log(
  "\nWow! Shocking... Paypal made money while everyone else's balance went down. One could argue that this is because Paypal provides a valuable service and is compensated for that, which is a fair and reasonable this to say. IF, however, Paypal gained a monopoly and started raising the fees... well then that would be a different story. Try playing with the model to see what happens with different fees.",
);

// The plot thickens...
console.log(
  "\nWell that was fun. But wait! There's more. It turns out that Eve was actually a space pirate, and Paypal is forbidden from serving space pirates. Upon hearing this news, Paypal adds Eve's address to the blacklist (duhn duhn duhn...). Eve is now banned from using Paypal or their services.",
);
paypal.addressBlacklist.push(eve.wallet.address);

console.log("Let's see what happens now...");
financialAttrition(
  alice,
  bob,
  carol,
  dave,
  eve,
  frank,
  george,
  harry,
  ian,
  jill,
);

console.log(
  "\nLooks like most of Paypal's users are now too broke or too outlawed to use the network... Hmmm if only there was a way for everyone to transact without a central operator. Oh wait, there is! Bitcoin, Ethereum, and other crypto-currencies allow users to send and receive value with (relatively) low fees. Best of all, anyone can participate! In the next chapter we'll explore what some of these networks look like :)",
);
