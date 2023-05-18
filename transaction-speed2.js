const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const sourceAddress = 'rK2bHJDAXnU52vW6BHueKzCCgEPRtgwRKT'; // testnet address
const destinationAddress = 'rPBXwLSxSHVf2pmxnsYNxKgXYzdbou5V8d';  //destination address
const amount = '100'; // the amount of XRP to send

async function sendXRP() {
  await api.connect();
  const startTime = Date.now(); // record the start time
  const preparedTx = await api.prepareTransaction({
    "TransactionType": "Payment",
    "Account": sourceAddress,
    "Amount": api.xrpToDrops(amount),
    "Destination": destinationAddress
  }, {
    "maxLedgerVersionOffset": 5
  });
  const signedTx = api.sign(preparedTx.txJSON, 'sEd7dxof3wojrpuWadeMnoTNyJcUHMo'); // testnet secret
  const result = await api.submit(signedTx.signedTransaction);
  const endTime = Date.now(); // record the end time
  console.log(result);
  console.log(`Transaction confirmed in ${(endTime - startTime) / 1000} seconds`); // print the time difference in seconds
  await api.disconnect();
}
sendXRP();
