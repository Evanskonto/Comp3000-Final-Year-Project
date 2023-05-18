const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233' // testnet
});

const sender = {
  address: 'rPb67cQF4K6MmE8kjrxu69ZJLUr1dorrSL',
  secret: 'sEd7V9WwkGBa2itpRZp1ynASKzsE3so'
};

const receiver = {
  address: 'rwaM91Hvjo8BG4EsoqCyKgHTdLK4egrhMA'
};

const amount = '10';
const memo = {
  data: 'HELLO FROM RIPPLE!',
  format: 'text/plain'
};

async function sendTransaction() {
  await api.connect();
  const preparedTx = await api.prepareTransaction({
    TransactionType: 'Payment',
    Account: sender.address,
    Amount: api.xrpToDrops(amount),
    Destination: receiver.address,
    Memos: [{Memo: memo}],
    Fee: '12'
  });
  const signedTx = api.sign(preparedTx.txJSON, sender.secret);
  const tx = await api.submit(signedTx.signedTransaction);
  console.log('Transaction result:', tx.resultCode);
  await api.disconnect();
}

const numTransactions = 2;
let startTime = Date.now();

for (let i = 0; i < numTransactions; i++) {
  sendTransaction();
}

let endTime = Date.now();
let totalTime = (endTime - startTime) / 1000;
console.log(`Sent ${numTransactions} transactions in ${totalTime} seconds`);
console.log(`Average transaction speed: ${numTransactions / totalTime} tps`);
