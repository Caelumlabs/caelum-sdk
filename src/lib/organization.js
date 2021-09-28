const debug = require('debug')('did:debug:org');
const axios = require('axios');
const { hexToString, u8aToString } = require('@polkadot/util');
const W3C = require('../utils/zenroom');
const SDK = require('./sdk');

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
    this.tokenId = '';
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
    if (this.did) await this.getData();
  }

  async registerToken(tokenName, tokenSymbol, amount) {
    // Create a new token.
    this.tokenId = await this.blockchain.createToken(this.keypair.address);

    await this.blockchain.setTokenMetadata(this.tokenId, tokenName, tokenSymbol, 0);
    await this.blockchain.transferTokenOwnership(this.tokenId, this.keypair.address);

    // Mint tokens.
    await this.blockchain.mintToken(this.tokenId, this.keypair.address, amount);
    return this.tokenId;
  }

  async registerOrganization(legalName, taxId, level, keys, amount) {
    debug(`registerOrg - ${legalName}`);
    await this.blockchain.registerDid(keys.address, level, legalName, taxId);
    await this.blockchain.wait4Event('DidRegistered');
    const did = await this.blockchain.getDidFromOwner(keys.address);
    debug(`DID = ${did}`);
    debug(`Mnemonic = ${keys.mnemonic}`);
    debug(`Address = ${keys.address}`);
    await this.blockchain.transferGas(keys.address, 1000000000000000);
    await this.blockchain.transferToken(this.tokenId, keys.address, amount);
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
    const info = {
      name, address, postalCode, city, countryCode, website, endpoint, phoneNumber,
    };
    await this.blockchain.changeInfo(this.did, info);
    await this.getData();
  }

  async getData() {
    const data = await this.blockchain.getDidData(this.did);
    this.owner = data.owner;
    if (this.tokenId) {
      const tokendata = await this.blockchain.getAccountTokenData(this.tokenId, data.owner);
      this.info.balance = tokendata.balance;
    }
    const signer = await this.blockchain.getKey(this.did);
    this.signer = { publicKey: u8aToString(signer).toString() };
    const gasdata = await this.blockchain.addrState(this.owner);
    this.info.gas = gasdata.balance.free.toHuman();
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
    this.info.level = data.level;
    this.certificates = await this.blockchain.getCertificatesByDID(this.did);
    return this.info;
  }

  async transferOwnership(newKeys) {
    this.blockchain.setKeyring(this.seed);

    // Transfer Ownership.
    await this.blockchain.transferDidOwnershipGasAndTokens(
      this.did, newKeys.address, this.tokenId, 'all', 'all',
    );

    // Update keyring.
    this.seed = newKeys.mnemonic;
    this.keypair = newKeys.keyPair;
    this.blockchain.setKeyring(this.seed);
  }

  async updateSigner(publicKey, privateKey) {
    this.signer = {
      publicKey,
      privateKey,
    };
  }

  async setSigner(keypair) {
    this.blockchain.setKey(keypair.public_key);
    await this.blockchain.wait4Event('KeySet');
    this.signer = {
      publicKey: keypair.public_key,
      privateKey: keypair.private_key,
    };
  }

  async registerCertificate(title, type, url = '', image = '') {
    const certificateDid = await this.blockchain.addCertificate(title, url, image, type);
    return certificateDid;
  }

  async getCertificates() {
    const result = await this.blockchain.getCertificatesByDID(this.did);
    return result;
  }

  /*
   * newCertificate
   * Creates a new Credential of type AuthorisedCapability
   *
   */
  async signCertificate(certificateDid, certificate, type) {
    // Base credential.
    const credential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://caelumapp.com/context/v1',
      ],
      type: ['VerifiableCredential', type],
      issuer: this.did,
      credentialSubject: {
        id: certificateDid,
        ...certificate.subject,
      },
    };
    if (certificate.validFrom) credential.credentialSubject.validFrom = certificate.validFrom;
    if (certificate.validTo) credential.credentialSubject.validTo = certificate.validTo;
    if (certificate.holder) credential.holder = certificate.holder;
    credential.issuanceDate = certificate.issuanceDate || new Date().toISOString();

    // Base Issuer.
    const issuer = {
      Issuer: {
        keypair: {
          public_key: this.signer.publicKey,
          private_key: this.signer.privateKey,
        },
        PublicKeyUrl: this.did,
      },
    };
    const signedCredential = await W3C.signCredential(credential, issuer);
    await this.blockchain.putHash(
      this.did,
      signedCredential.proof.jws,
      certificateDid,
      type,
    );
    await this.blockchain.wait4Event('CredentialAssigned');
    return signedCredential;
  }

  /**
   * Verify a credential
   *
   * @param {object} credential The signed Verifiable credential
   */
  async verifyCredential(signedCredential) {
    const valid = await W3C.verifyCredential(signedCredential, this.signer.publicKey);
    const hash = await this.blockchain.getHash(signedCredential.proof.jws);
    // TODO : Verify
    return valid;
  }

  /*
   * get all Hashes
   */
  async getHashes() {
    const hashes = await this.blockchain.getAllHashesForDid(this.did);
    return hashes;
  }

  async getSession(capability) {
    return new Promise((resolve) => {
      axios.post(`${this.info.endpoint}auth/session`, { capability })
        .then((result) => {
          // 1 - login/register to Tabit network (last param)
          const connectionString = `1-${result.data.sessionIdString}-${this.did}-1`;
          resolve({ sessionIdString: result.data.sessionIdString, connectionString });
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  async startSdk() {
    this.sdk = new SDK(this.caelum, this.did, '', this.info.endpoint, 'peerdid');
  }

  waitSession(sessionIdString) {
    return new Promise((resolve) => {
      axios.get(`${this.info.endpoint}auth/session/wait/${sessionIdString}`)
        .then(async (result) => {
          this.sdk = new SDK(this.caelum, this.did, result.data.tokenApi, this.info.endpoint);
          this.parameters = (result.data.capability === 'admin') ? await this.sdk.call('parameter', 'getAll') : false;
          resolve(result.data);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  async setSession(tokenApi, capability) {
    this.sdk = new SDK(this.caelum, this.did, tokenApi, this.info.endpoint, capability);
    this.parameters = (capability === 'admin') ? await this.sdk.call('parameter', 'getAll') : false;
  }

  /*
  async export (password) {
    const keys = Crypto.encryptObj(password, this.keys)
    const json = JSON.stringify({ did: this.did, keys: keys })
    return json
  }

  async import (data, password) {
    this.did = data.did
    this.keys = Crypto.decryptObj(password, data.keys)
  }
  */
};
