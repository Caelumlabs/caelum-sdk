const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();

  // Connect ROOT Organization.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);
  await root.registerToken(
    process.env.TOKEN_ID,
    process.env.TOKEN_NAME,
    process.env.TOKEN_SYMBOL,
    1000000000,
  );

  // Register Basic Token.
  const token = await caelum.getTokenDetails(process.env.TOKEN_ID);
  console.log('Token Details', token);

  const balance = await caelum.getTokenBalance(process.env.TOKEN_ID, root.keypair.address);
  console.log(`Balance ${balance} ${process.env.TOKEN_SYMBOL}`);

  // Set costs in Tokens for actions.
  await caelum.setEcosystemCosts(process.env.ROOT_SEED, {
    registerDid: [process.env.TOKEN_ID, 50],
    setKey: [process.env.TOKEN_ID, 5],
    putHash: [process.env.TOKEN_ID, 1],
    changeLegalNameOrTaxId: [process.env.TOKEN_ID, 5],
    updateInfo: [process.env.TOKEN_ID, 5],
    changeDidOwner: [process.env.TOKEN_ID, 5],
    revokeHash: [process.env.TOKEN_ID, 5],
    removeDid: [process.env.TOKEN_ID, 50],
    addCertificate: [process.env.TOKEN_ID, 10],
    revokeCertificate: [process.env.TOKEN_ID, 10],
    addDocument: [process.env.TOKEN_ID, 1],
    addAttachment: [process.env.TOKEN_ID, 1],
    startProcess: [process.env.TOKEN_ID, 0],
    startSubprocess: [process.env.TOKEN_ID, 0],
    startStep: [process.env.TOKEN_ID, 0],
  });
  // Disconnect.
  await caelum.disconnect();
};

/*
 balance: 100, isFrozen: false, isSufficient: true }
* Main
*/
const main = async () => {
  await init();
};

main();
