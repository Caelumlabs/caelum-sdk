const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);

  // Transfer Ownership.
  const newKeys = await caelum.newCertificateKeys();
  console.log(newKeys);
  // console.log(`Org admin Addr: ${newKeys.address}`);
  await orgAdmin.setKeys(newKeys.Organization.keypair.public_key);

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
