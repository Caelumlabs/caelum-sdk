const GOVERNANCE = 'ws://127.0.0.1:9944';
const Caelum = require('../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(GOVERNANCE);
  await caelum.connect();

  // Connect as root.
  const root = await caelum.getOrganizationFromSeed('//Alice');
  await root.registerOrganization('CaelumLabs', 'B111', 2000);

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
