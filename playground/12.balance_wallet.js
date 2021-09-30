const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  const balance = await caelum.getTokenBalance(process.env.TOKEN_PAYMENT_DID, process.env.USER_WALLET);
  console.log(`Token = ${balance} ${process.env.TOKEN_PAYMENT_SYMBOL}`);

  // Disconnect.
  await caelum.disconnect();
};

/*
* Main
*/
const main = async () => {
  await init();
};

main();
