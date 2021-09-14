const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE, process.env.TOKENID);
  await caelum.connect();

  // Connect to organization.
  console.log('DID',process.env.ORG_DID);
  const orgAdmin = await caelum.getOrganizationFromDid(process.env.ORG_DID);
  console.log(orgAdmin.info);
  console.log(orgAdmin.certificates);
  console.log(`Owner = ${orgAdmin.owner}`);
  console.log(`Signer = ${orgAdmin.signer.publicKey}`);

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
