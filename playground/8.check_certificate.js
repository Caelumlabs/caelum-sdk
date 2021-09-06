const {validateChars} = require('@polkadot/util-crypto/base58/validate');
const Caelum = require('../src/index');
const signedCredential = require('./admin.json');
// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);
  const hashes = await orgAdmin.getHashes();
  console.log(hashes);

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
