const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Create new wallet.
  const userKeys = await caelum.newBlockchainKeys();
  console.log(`Wallet Seed: ${userKeys.mnemonic}`);
  console.log(`Wallet Addr: ${userKeys.address}`);

  // Connect as root.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);

  const balance = await caelum.getTokenBalance(process.env.TOKEN_PAYMENT_DID, userKeys.address);
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
