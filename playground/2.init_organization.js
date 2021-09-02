const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Create new organization.
  const orgKeys = await caelum.newBlockchainKeys();
  console.log(`Org admin Seed: ${orgKeys.mnemonic}`);
  console.log(`Org admin Addr: ${orgKeys.address}`);

  // Connect as root.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);
  console.log('Register DID');
  const newOrg = await root.registerOrganization(
    process.env.LEGAL_NAME,
    process.env.TAX_ID,
    2000,
    orgKeys,
    process.env.TOKEN_ID,
    100,
  );

  console.log(`Org admin DID: ${newOrg.did}`);

  const balance = await caelum.getTokenBalance(process.env.TOKEN_ID, orgKeys.address);
  console.log(`Token = ${balance} ${process.env.TOKEN_SYMBOL}`);

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
