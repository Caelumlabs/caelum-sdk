require('dotenv').config();
const Organization = require('./lib/organization');
const Blockchain = require('./utils/substrate');
const W3C = require('./utils/zenroom');
const Crypto = require('./utils/crypto');

/**
 * Caelum main library
 */
module.exports = class Caelum {
  /**
   * Constructor
   *
   * @param {string} url BigchainDB server API
   */
  constructor(blockchainUrl) {
    this.blockchain = new Blockchain(blockchainUrl);
    this.crypto = Crypto;
  }

  async connect() {
    await this.blockchain.connect();
  }

  async disconnect() {
    await this.blockchain.disconnect();
  }

  async newBlockchainKeys() {
    const keys = await this.blockchain.newKeys();
    return keys;
  }

  async newCertificateKeys() {
    const keys = await W3C.newKeys('Organization');
    return keys;
  }

  async sendGas(mnemonic, addr) {
    this.blockchain.setKeyring(mnemonic);
    await this.blockchain.transferTokens(addr, 3000000000000000);
    const state = await this.blockchain.addrState(addr);
    return state;
  }

  async getTokenDetails(tokenId) {
    const tokenDetails = await this.blockchain.getTokenDetails(tokenId);
    return tokenDetails;
  }

  async transferTokens(seed, tokenId, amount, toAddr) {
    await this.blockchain.transferToken(tokenId, toAddr, amount);
  }

  async getTokenBalance(tokenId, addr) {
    const tokenAccountData = await this.blockchain.getAccountTokenData(tokenId, addr);
    return tokenAccountData.balance;
  }

  async getOrganizationFromSeed(seed) {
    const org = new Organization(this.blockchain);
    await org.loadFromSeed(seed);
    return org;
  }

  async getOrganizationFromDid(did) {
    const org = new Organization(this.blockchain, did);
    await org.getData();
    return org;
  }

  async setEcosystemCosts(seed, costs) {
    this.blockchain.setKeyring(seed);
    await this.blockchain.setTokensAndCosts(costs);
  }

  /**
   * newOrganization. creates an organization Object
   *
   * @param {object} data Data can be a DID (string) or an object with {legalName and taxID}
   */
  /*
  async newOrganization (did = false, newKeys = false) {
    const organization = new Organization(this, did)
    if (newKeys) await organization.newKeys()
    return organization
  }
  */

  /**
   * newUser. creates a new User object
   */
  /*
  async newUser (importJson = false) {
    let connections = {}; let credentials = {}; const orgs = {}
    if (importJson !== false) {
      connections = importJson.connections
      credentials = importJson.credentials
      for (const did in connections) {
        orgs[did] = await this.loadOrganization(did)
      }
    }
    const user = new User(this, connections, credentials, orgs)
    return user
  }
*/
  /**
   * newOrganization. creates an organization Object
   *
   * @param {object} data Data can be a DID (string) or an object with {legalName and taxID}
   */
  /*
  async importOrganization (data, password) {
    const organization = new Organization(this)
    await organization.import(data, password)
    return organization
  }
*/
  /**
   * loadOrganization. Retrieves an organization
   *
   * @param {string} createTxId Transaction ID
   * @param {string} did DID
   */
  /*
  async loadOrganization (did) {
    const organization = new Organization(this, did)
    await organization.loadInformation()
    return organization
  }

  static loadCrypto () {
    return Crypto
  }
  */
};
