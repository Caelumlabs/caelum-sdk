const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();
  // Connect ROOT Organization.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);
  const tokenId = await root.registerToken(
    process.env.TOKEN_PAYMENT_NAME,
    process.env.TOKEN_PAYMENT_SYMBOL,
    1000000000,
  );

  // Register Basic Token.
  const token = await caelum.getTokenDetails(tokenId);
  console.log('Token Details', token);

  const balance = await caelum.getTokenBalance(tokenId, root.keypair.address);
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
