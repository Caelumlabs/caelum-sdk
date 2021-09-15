const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);
  orgAdmin.updateSigner(process.env.SIGNER_PUBLICKEY, process.env.SIGNER_PRIVATEKEY);

  // Issue certificate.
  const certificate = {
    holder: '12223232323',
    subject: {
      capability: { type: 'admin', sphere: 'professional' },
    },
    issuanceDate: '2021-05-03T12:25:19.526Z',
  };
  const signedCredential = await orgAdmin.signCertificate(process.env.CERTIFICATE_DID, certificate, 'AuthorisedCapability');
  console.log(signedCredential);
  console.log('1'); process.exit();

  const validCredential = await orgAdmin.verifyCredential(signedCredential);
  console.log(`Validation: ${validCredential}`);

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
