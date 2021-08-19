const debug = require('debug')('did:debug:org');
const { hexToString } = require('@polkadot/util');

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
    await this.blockchain.createToken(tokenId, this.keypair.address, 0);
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

  async updateInformation(name, address, postalCode, city, countryCode, phoneNumber, website, endpoint) {
    this.blockchain.setKeyring(this.seed);
    const tokenAccountData = await this.blockchain.getAccountTokenData(1, this.keypair.address);
    console.log(tokenAccountData);
    this.info = {
      name, address, postalCode, city, countryCode, website, endpoint, phoneNumber
    };
    await this.blockchain.changeInfo(this.did, this.info);
  }

  async getData() {
    const data = await this.blockchain.getDidData(this.did);
    this.info.legalName = hexToString(data.legal_name);
    this.info.taxId = hexToString(data.tax_id);
    this.info.name = (data.info.name) ? hexToString(data.info.name) : '';
    this.info.address = (data.info.address) ? hexToString(data.info.address) : '';
    this.info.postalCode = (data.info.address) ? hexToString(data.info.postal_code) : '';
    this.info.city = (data.info.city) ? hexToString(data.info.city) : '';
    this.info.countryCode = (data.info.country_code) ? hexToString(data.info.country_code) : '';
    this.info.phoneNumber = (data.info.phone_number) ? hexToString(data.info.phone_number) : '';
    this.info.website = (data.info.website) ? hexToString(data.info.website) : '';
    this.info.endpoint = (data.info.endpoint) ? hexToString(data.info.endpoint) : '';

    return this.info;
  }
};
