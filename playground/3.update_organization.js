const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect to organization.
  const orgAdmin = await caelum.getOrganizationFromSeed(process.env.ORG_SEED);

  // Update Information.
  await orgAdmin.updateInformation(
    process.env.ORG_NAME,
    process.env.ORG_ADDRESS,
    process.env.ORG_POSTAL,
    process.env.ORG_CITY,
    process.env.ORG_COUNTRY,
    process.env.ORG_URL,
    process.env.ORG_ENDPOINT,
  );

  const information = await orgAdmin.getData(orgAdmin.did);
  console.log(information);

  const balance = await caelum.getTokenBalance(process.env.TOKEN_ID, orgAdmin.keypair.address);
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
