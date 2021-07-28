const GOVERNANCE = 'ws://127.0.0.1:9944';
const Caelum = require('../../src/index');

// Main function.
const init = async () => {
  // Connect Caelum-SDK.
  const caelum = new Caelum(GOVERNANCE);
  await caelum.connect();

  // Register Token.
  const token = await caelum.getTokenDetails(1);
  console.log('Token', token);
  // console.log('Token', await caelum.getTokenDetails(1));

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
