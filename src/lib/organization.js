const debug = require('debug')('did:debug:org');

/**
 * Schema.org: Organization.
 * URL https://schema.org/Organization
 */
module.exports = class Organization {
  /**
   * Constructor. It creates an Organization object.
   */
  constructor(blockchain, did = false) {
    this.did = did;
    this.seed = '';
    this.keypair = {};
    this.info = {};
    this.data = false;
    this.blockchain = blockchain;
  }

  async loadFromSeed(seed) {
    this.blockchain.setKeyring(seed);
    this.did = await this.blockchain.getDidFromOwner();
    this.seed = seed;
    this.keypair = this.blockchain.getKeyring(seed);
    await this.getData();
  }

  async registerToken(tokenId, tokenName, tokenSymbol, amount) {
    // Create a new token.
    await this.blockchain.createToken(tokenId, this.keypair.address, 100);
    await this.blockchain.setTokenMetadata(tokenId, tokenName, tokenSymbol, 0);
    await this.blockchain.transferTokenOwnership(tokenId, this.keypair.address);

    // Mint tokens.
    await this.blockchain.mintToken(tokenId, this.keypair.address, amount);
  }

  async registerOrganization(legalName, taxId, level, keys, tokenId, amount) {
    debug(`registerOrg - ${legalName}`);
    await this.blockchain.registerDid(keys.address, level, 2, legalName, taxId);
    await this.blockchain.wait4Event('DidRegistered');
    const did = await this.blockchain.getDidFromOwner(keys.address);
    debug(`DID = ${did}`);
    debug(`Mnemonic = ${keys.mnemonic}`);

    await this.blockchain.transferTokens(keys.address, 1000);
    await this.blockchain.transferToken(tokenId, keys.address, amount);
    const newOrg = new Organization(this.blockchain, did);
    newOrg.keys = keys;
    return newOrg;
  }

  async updateInformation(name, address, postalCode, city, countryCode, website, endpoint) {
    this.blockchain.setKeyring(this.seed);
    this.info = {
      name, address, postalCode, city, countryCode, website, endpoint,
    };
	console.log(this.did, this.info);
    await this.blockchain.changeInfo(this.did, this.info);
  }

  async getData() {
    this.data = await this.blockchain.getDidData(this.did);
    return this.data;
  }
};
