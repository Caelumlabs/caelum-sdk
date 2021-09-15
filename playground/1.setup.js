const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(process.env.SUBSTRATE);
  await caelum.connect();
  // Connect ROOT Organization.
  const root = await caelum.getOrganizationFromSeed(process.env.ROOT_SEED);
  console.log('Register Tokens');
  const tokenId = await root.registerToken(
    process.env.TOKEN_NAME,
    process.env.TOKEN_SYMBOL,
    1000000000,
  );
  console.log('get Detail');
  const token = await caelum.getTokenDetails(tokenId);
  console.log('Token Details', token);

  const balance = await caelum.getTokenBalance(tokenId, root.keypair.address);
  console.log(`Balance ${balance} ${process.env.TOKEN_SYMBOL}`);

  // Set costs in Tokens for actions.
  await caelum.setEcosystemCosts(process.env.ROOT_SEED, {
    registerDid: [tokenId, 50],
    setKey: [tokenId, 5],
    putHash: [tokenId, 1],
    changeLegalNameOrTaxId: [tokenId, 5],
    updateInfo: [tokenId, 5],
    changeDidOwner: [tokenId, 5],
    revokeHash: [tokenId, 5],
    removeDid: [tokenId, 50],
    addCertificate: [tokenId, 10],
    revokeCertificate: [tokenId, 10],
    addDocument: [tokenId, 1],
    addAttachment: [tokenId, 1],
    startProcess: [tokenId, 0],
    startSubprocess: [tokenId, 0],
    startStep: [tokenId, 0],
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
