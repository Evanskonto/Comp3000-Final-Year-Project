const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const txHash = 'C7E60C3AE5135292F356F9C378F7788F9181B38287694B08DABCC883C7B64A75';

async function getTransaction() {
  await api.connect();
  const tx = await api.getTransaction(txHash, { includeRawTransaction: true });
  console.log(tx.outcome.timestamp); // prints the timestamp when the transaction was validated
  await api.disconnect();
}

getTransaction();
