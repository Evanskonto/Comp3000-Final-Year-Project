const RippleAPI = require('ripple-lib').RippleAPI;

async function main() {
  const api = new RippleAPI({
    server: 'wss://s.altnet.rippletest.net:51233'
  });

  await api.connect();

  const txHash = 'C7E60C3AE5135292F356F9C378F7788F9181B38287694B08DABCC883C7B64A75'; 

  const transaction = await api.getTransaction(txHash);

  console.log(transaction);

  await api.disconnect();
}

main();
