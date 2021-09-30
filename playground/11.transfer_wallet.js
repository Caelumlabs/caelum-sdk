const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Create new wallet.
  const amount = 1250;

  // Connect as root.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);
  await root.transferToken(process.env.TOKEN_PAYMENT_DID, process.env.USER_WALLET, amount)

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
