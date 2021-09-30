const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();
  // Connect ROOT Organization.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);

  // Register Basic Token.
  const token = await caelum.getTokenDetails(process.env.TOKEN_PAYMENT_DID);
  console.log('Token Details', token);

  const balance = await caelum.getTokenBalance(process.env.TOKEN_PAYMENT_DID, root.keypair.address);
  console.log(`Balance ${balance} ${process.env.TOKEN_PAYMENT_SYMBOL}`);

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
