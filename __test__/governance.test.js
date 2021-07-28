const GOVERNANCE = 'ws://127.0.0.1:9944';
const Caelum = require('../src/index');
let caelum, root

describe('Connect to Blockchain', () => {
  it('Connect to Blockchain', async () => {
    caelum = new Caelum(GOVERNANCE);
    await caelum.connect();
    expect(caelum.status).toBe('connected');
    root = await caelum.getOrganizationFromSeed('//Alice');
    expect(root.info.did).toBeDefined();
  });

  it('Register a new organization', async () => {
    await root.registerOrganization('CaelumLabs', 'B111', 2000);
  });

  it('Register a new organization', async () => {
    await caelum.disconnect();
    expect(caelum.status).toBe('connected');
  });
});
