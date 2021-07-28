require('dotenv').config();
const Organization = require('./lib/organization');
const Blockchain = require('./utils/substrate');

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
  }

  async connect() {
    await this.blockchain.connect();
  }

  async disconnect() {
    await this.blockchain.disconnect();
  }

  async newKeys() {
    const keys = await this.blockchain.newKeys();
    return keys;
  }

  async sendGas(mnemonic, addr) {
    this.blockchain.setKeyring(mnemonic);
    console.log('Send gas to ' + addr)
    await this.blockchain.transferTokens(addr, 3000000000000000);
    return await this.blockchain.addrState(addr)
  }

  async registerToken(mnemonic, tokenId, tokenName, tokenSymbol) {
    const admin = this.blockchain.setKeyring(mnemonic);
    // Create a new token
    console.log(admin);
    const amount = await this.blockchain.addrState(admin.address);
    console.log(amount);
    let result = await this.blockchain.createToken(tokenId, admin, 100);
    // result = await this.blockchain.setTokenMetadata(tokenId, tokenName, tokenSymbol, 0);
  }

  async getTokenDetails(tokenId) {
    const tokenDetails = await this.blockchain.getTokenDetails(tokenId);
    return tokenDetails;
  }

  async getOrganizationFromSeed(seed) {
    this.blockchain.setKeyring(seed);
    const did = await this.blockchain.getDidFromOwner();
    const org = new Organization(this.blockchain, did);
    await org.getData();
    return org;
  }

  async getOrganizationFromDid(did) {
    const org = new Organization(this.blockchain, did);
    await org.getData();
    return org;
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
