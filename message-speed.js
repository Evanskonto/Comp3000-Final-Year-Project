const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

const txHash = '50296E3D8117BF197155117E8DEE35E743390528D9D9A5F963EE330228C0FE42'; 

async function getTransaction() {
  await api.connect();
  const tx = await api.getTransaction(txHash, { includeRawTransaction: true });
  console.log(tx.outcome.timestamp); // prints the timestamp when the transaction was validated
  await api.disconnect();
}

getTransaction();

