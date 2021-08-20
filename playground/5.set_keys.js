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
  console.log(`Signer Private Key: ${newKeys.Organization.keypair.private_key}`);
  console.log(`Signer Public Key: ${newKeys.Organization.keypair.public_key}`);
  await orgAdmin.setSigner(newKeys.Organization.keypair);

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
