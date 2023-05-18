const RippleAPI = require('ripple-lib').RippleAPI;

const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // Test network server
});

async function createNewAddress() {
  await api.connect();
  const address = await api.generateAddress();
  console.log('New address: ' + address.address);
  console.log('Secret key: ' + address.secret);
  await api.disconnect();
}

createNewAddress();
