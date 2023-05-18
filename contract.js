const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const sourceAddress = 'raBjWL67TURLVok53jdm7ow2L7miudkdbS'; // my testnet address
const destinationAddress = 'rwaM91Hvjo8BG4EsoqCyKgHTdLK4egrhMA';
const amount = '5'; // the amount of XRP
const numTransactions = 100; // number of transactions to send

async function sendXRP() {
  await api.connect();
  const startTime = Date.now(); // start time of sending transactions

  for (let i = 0; i < numTransactions; i++) {
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sourceAddress,
      "Amount": api.xrpToDrops(amount),
      "Destination": destinationAddress
    }, {
      "maxLedgerVersionOffset": 5
    });
    const signedTx = api.sign(preparedTx.txJSON, 'sEd78qQr7eRNKY8SceVFmkFC5QHJDYf'); // my secret
    const result = await api.submit(signedTx.signedTransaction);
    console.log(`Transaction ${i+1}: ${result.resultCode}`);
  }

  const endTime = Date.now(); // end time of sending transactions
  const totalTime = (endTime - startTime) / 1000; // total time in seconds
  console.log(`Sent ${numTransactions} transactions in ${totalTime} seconds`);
  console.log(`Average transaction speed: ${numTransactions / totalTime} tps`);

  await api.disconnect();
} 

sendXRP();
