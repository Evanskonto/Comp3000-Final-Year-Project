const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const sourceAddress = 'rNc7rzMpY9xEy2PjPhLyPTQRDxyQmuuSuZ';
const destinationAddress = 'rGaXY87RV7ShmzmNWWwBWaWPfYuwp2ZMqu';
const amount = '5';
const message = 'THIS IS MY TEST MESSAGE';
const numTransactions = 100; // number of transactions to send

async function sendMessage() {
  await api.connect();
  const startTime = Date.now(); // start time of sending transactions

  for (let i = 0; i < numTransactions; i++) {
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sourceAddress,
      "Amount": api.xrpToDrops(amount),
      "Destination": destinationAddress,
      "Memos": [{
        "Memo": {
          "MemoType": "68656c6c6f",
          "MemoData": Buffer.from(`${message} ${i+1}`).toString('hex') // Add a unique identifier to the message
        }
      }]
    }, {
      "maxLedgerVersionOffset": 5
    });
    const signedTx = api.sign(preparedTx.txJSON, 'sEdSeEXMRX13d6Vx7EWWrD1QJJWQxdr');
    const result = await api.submit(signedTx.signedTransaction);
    console.log(`Transaction ${i+1}: ${result.resultCode}`);
  }

  const endTime = Date.now(); // end time of sending transactions
  const totalTime = (endTime - startTime) / 1000; // total time in seconds
  console.log(`Sent ${numTransactions} messages in ${totalTime} seconds`);
  console.log(`Average message speed: ${numTransactions / totalTime} mps`);

  await api.disconnect();
}

sendMessage();
