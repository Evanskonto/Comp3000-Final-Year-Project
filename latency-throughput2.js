const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});
const sourceAddress = 'rnsCFEHfajK1RBB2rsu9cm1nQ4x8kj2iqK'; //  testnet address
const destinationAddress = 'rPBXwLSxSHVf2pmxnsYNxKgXYzdbou5V8d';  //destination address
const amount = '1'; // the amount of XRP to send
const numTransactions = 10; // number of transactions to send
async function sendXRP() {
  await api.connect();
  let totalLatency = 0;
  let totalTxTime = 0; // total time of sending transactions
  const startTime = Date.now(); // start time of sending transactions

  for (let i = 0; i < numTransactions; i++) {
    const txStartTime = Date.now(); // start time of sending the transaction
    const preparedTx = await api.prepareTransaction({
      "TransactionType": "Payment",
      "Account": sourceAddress,
      "Amount": api.xrpToDrops(amount),
      "Destination": destinationAddress
    }, {
      "maxLedgerVersionOffset": 5
    });
    const signedTx = api.sign(preparedTx.txJSON, 'sEdSVaeeFrrZhMaj9BNA3uP6kzyN5gM'); // testnet secret
    const result = await api.submit(signedTx.signedTransaction);
    const txEndTime = Date.now(); // end time of sending the transaction
    const txLatency = txEndTime - txStartTime; // latency of the transaction in milliseconds
    totalLatency += txLatency;
    totalTxTime += (txEndTime - txStartTime) / 1000; // add the transaction time in seconds
    console.log(`Transaction ${i+1}: ${result.resultCode}, Latency: ${txLatency/1000} s`);
  }

  const endTime = Date.now(); // end time of sending transactions
  const totalTime = (endTime - startTime) / 1000; // total time in seconds
  const throughput = numTransactions / totalTime; // throughput in transactions per second
  const avgLatency = totalLatency / numTransactions; // average latency of the transactions in milliseconds
  const avgTxTime = totalTxTime / numTransactions; // average transaction time in seconds
  console.log(`Sent ${numTransactions} transactions in ${totalTime} seconds`);
  console.log(`Throughput: ${throughput} tps`);
  console.log(`Average latency: ${avgLatency/1000} s`);
  console.log(`Average transaction time: ${avgTxTime} s`);
  await api.disconnect();
}
sendXRP();

