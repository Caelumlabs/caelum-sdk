const GOVERNANCE = 'ws://127.0.0.1:9944';
const debug = require('debug')('did:setup');
const Caelum = require('../../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(GOVERNANCE);
  await caelum.connect();

  // New keys for token admin. Get some gas.
  const tokenAdmin = await caelum.newKeys();
  debug(`Admin: ${tokenAdmin.mnemonic}`);

  // Register Token.
  await caelum.registerToken('//Alice', 6, 'Caelum Ecosistem', 'CLAB', tokenAdmin.address);

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
