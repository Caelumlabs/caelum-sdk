require('dotenv').config();
const Organization = require('./lib/organization');
const User = require('./lib/user');
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

  async connect(userJson = false, did = false) {
    await this.blockchain.connect();
    const user = (userJson !== false) ? await this.newUser(userJson) : false;
    const idspace = (did !== false ) ? await this.getOrganizationFromDid(did) : false;
    if (user && idspace) await user.login(idspace, 'admin');
    if (!user && idspace) await idspace.startSdk();
    return {user, idspace};
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
   * newUser. creates a new User object
   */
  async newUser(importJson = false) {
    let connections = {};
    let credentials = {};
    const orgs = {};
    if (importJson !== false) {
      connections = importJson.connections;
      credentials = importJson.credentials;
      for (const did in connections) {
        orgs[did] = await this.getOrganizationFromDid(did);
      }
    }
    const user = new User(this, connections, credentials, orgs);
    return user;
  }

  async verifySession(signedCredential) {
    const peerDid = signedCredential.issuer.split(':');
    const valid = await W3C.verifyCredential(signedCredential, peerDid[2]);
    return valid;
  }
};
