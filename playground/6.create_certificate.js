const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);

  // Transfer Ownership.
  const certificateDid = await orgAdmin.registerCertificate('Member of CaelumLabs', 'memberOf');
  console.log(`CertificateDid = ${certificateDid}`);

  // console.log(`Org admin Addr: ${newKeys.address}`);
  console.log(await orgAdmin.getCertificates());

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
