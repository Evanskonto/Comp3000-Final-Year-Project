const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const sourceAddress = 'r9G18tcoYJ7apA8NiSRLnA7QDv1tFfaJ8j'; // my testnet address
const destinationAddress = 'rPBXwLSxSHVf2pmxnsYNxKgXYzdbou5V8d'; //destination address
const amount = '10'; // the amount of XRP to send

async function sendXRP() {
  await api.connect();
  const preparedTx = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": sourceAddress,
    "Amount": api.xrpToDrops(amount),
    "Destination": destinationAddress
  }, {
    "maxLedgerVersionOffset": 5
  });
  const signedTx = api.sign(preparedTx.txJSON, 'sEdT8qadYT29dSUkMhDFCMRBZvBaHqw'); // testnet secret
  const result = await api.submit(signedTx.signedTransaction);
  console.log(result);
  const txHash = result.tx_json.hash;
  console.log("Transaction hash:", txHash);
  const start = Date.now();
  while (true) {
    const tx = await api.getTransaction(txHash, { minLedgerVersion: result.ledger_index });
    if (tx.outcome && tx.outcome.timestamp) {
      const end = Date.now();
      console.log("Transaction confirmed in", (end - start) / 1000, "seconds");
      break;
    }
  }
  await api.disconnect();
}

sendXRP();

