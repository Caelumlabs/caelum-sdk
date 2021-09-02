const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);
  orgAdmin.updateSigner(process.env.SIGNER_PUBLICKEY, process.env.SIGNER_PRIVATEKEY);

  // Create certificate.
  const capability = orgAdmin.newAuthorisedCapability(
    '2156156215',
    1,
    'admin',
    'professional',
    0,
    0,
  );

  const signedCredential = await orgAdmin.signCapability(capability, '1');
  console.log(signedCredential);

  const validCredential = await orgAdmin.verifyCredential(signedCredential);
  console.log(validCredential);

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
