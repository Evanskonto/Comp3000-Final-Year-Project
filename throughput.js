const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const sourceAddress = 'r9G18tcoYJ7apA8NiSRLnA7QDv1tFfaJ8j'; //  testnet address
const destinationAddress = 'rPBXwLSxSHVf2pmxnsYNxKgXYzdbou5V8d'; //destiantion address
const amount = '1'; //  the amount of XRP to send

async function sendXRP() {
  await api.connect();

  const startTime = Date.now();

  const preparedTx = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": sourceAddress,
    "Amount": api.xrpToDrops(amount),
    "Destination": destinationAddress
  }, {
    "maxLedgerVersionOffset": 5
  });

  const signedTx = api.sign(preparedTx.txJSON, 'sEdT8qadYT29dSUkMhDFCMRBZvBaHqw'); //testnet secret
  const result = await api.submit(signedTx.signedTransaction);
  console.log(result);

  api.connection.on('ledger_closed', async () => {
    const tx = await api.getTransaction(result.tx_json.hash);
    if (tx.outcome.result === 'tesSUCCESS') {
      const endTime = Date.now();
      const elapsed = endTime - startTime;
      console.log(`Transaction confirmed in ${elapsed} ms`);
      console.log(`Throughput: ${amount} XRP in ${elapsed} ms`);
      await api.disconnect();
    }
  });
}

sendXRP();

