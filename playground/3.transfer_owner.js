const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);

  // Transfer Ownership.
  const newKeys = await caelum.newBlockchainKeys();
  console.log(`Org admin Seed: ${newKeys.mnemonic}`);
  console.log(`Org admin Addr: ${newKeys.address}`);
  await orgAdmin.transferOwnership(newKeys, process.env.TOKEN_ID);

  const balance = await caelum.getTokenBalance(process.env.TOKEN_ID, orgAdmin.keypair.address);
  console.log(`Balance ${orgAdmin.keypair.address} = ${balance} ${process.env.TOKEN_SYMBOL}`);

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
