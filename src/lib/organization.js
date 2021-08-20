const debug = require('debug')('did:debug:org');
const { hexToString, stringToHex, u8aToString } = require('@polkadot/util');
const TOKENID = 1

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

	console.log(`Transfer tokens to ${keys.address}`);
    await this.blockchain.transferTokens(keys.address, 100000000000);
    await this.blockchain.transferToken(tokenId, keys.address, amount);
    const newOrg = new Organization(this.blockchain, did);
    newOrg.keys = keys;
    return newOrg;
  }

  async updateInformation(
    name,
    address,
    postalCode,
    city,
    countryCode,
    phoneNumber,
    website,
    endpoint,
  ) {
    this.blockchain.setKeyring(this.seed);
    this.info = {
      name, address, postalCode, city, countryCode, website, endpoint, phoneNumber,
    };
    await this.blockchain.changeInfo(this.did, this.info);
  }

  async getData() {
    const data = await this.blockchain.getDidData(this.did);
    this.owner = data.owner;
    const tokendata = await this.blockchain.getAccountTokenData(TOKENID, data.owner);
    this.info.balance = tokendata.balance;
    const signer = await this.blockchain.getKey(this.did);
    this.signer = { publicKey: u8aToString(signer).toString() };
	  console.log('++++'+this.owner);
    const gasdata = await this.blockchain.addrState(this.owner);
    this.info.gas = gasdata.balance.free.toHuman();
    this.info.did = `did:caelum:${this.did}`;
    this.info.legalName = hexToString(data.legal_name);
    this.info.taxId = hexToString(data.tax_id);
    this.info.name = (data.info.name) ? hexToString(data.info.name) : '';
    this.info.address = (data.info.address) ? hexToString(data.info.address) : '';
    this.info.postalCode = (data.info.postal_code) ? hexToString(data.info.postal_code) : '';
    this.info.city = (data.info.city) ? hexToString(data.info.city) : '';
    this.info.countryCode = (data.info.country_code) ? hexToString(data.info.country_code) : '';
    this.info.phoneNumber = (data.info.phone_number) ? hexToString(data.info.phone_number) : '';
    this.info.website = (data.info.website) ? hexToString(data.info.website) : '';
    this.info.endpoint = (data.info.endpoint) ? hexToString(data.info.endpoint) : '';

    return this.info;
  }

  async transferOwnership(newKeys, tokenId) {
    this.blockchain.setKeyring(this.seed);

    // Transfer Ownership.
    console.log('1. Change owner');
    await this.blockchain.changeOwner(this.did, newKeys.address);

    // Transfer all gas to new addr.
    console.log('2. Move Gas');
    // console.log(await this.blockchain.getAccountTokenData(tokenId, this.keypair.address));
    // await this.blockchain.transferAllTokens(newKeys.address);

    // Transfer all tokens to new addr.
    const tokenAccountData = await this.blockchain.getAccountTokenData(tokenId, this.owner);
    console.log("3. Transfer Tokens to " + newKeys.address, tokenAccountData.balance);
    await this.blockchain.transferToken(TOKENID, newKeys.address, tokenAccountData.balance - 1);

    // Update keyring.
    console.log('4.update keys');
    this.seed = newKeys.mnemonic;
    this.keypair = newKeys.keyPair;
    console.log('Set seed ');
    this.blockchain.setKeyring(this.seed);
  }

  async setKeys(signerPublicKey) {
    this.blockchain.setKey(signerPublicKey);
    await this.blockchain.wait4Event('KeySet');
  }

  async registerCertificate(cid, title, url, image, type) {
    await this.blockchain.addCertificate(stringToHex(cid), title, url, image, type);
    await this.blockchain.wait4Event('CIDCreated');
  }

  async getCertificates() {
    const result = await this.blockchain.getCertificatesByDID(this.did);
    return result;
  }
};
