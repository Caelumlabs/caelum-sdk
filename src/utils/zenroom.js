// const didDoc = require('./diddoc')
/* eslint-disable */
const { zencode_exec } = require('zenroom')

const zexecute = (zencode, _data = {}, _keys = {}) => {
  return new Promise((resolve, reject) => {
    const keys = JSON.stringify(_keys);
    const data = JSON.stringify(_data);
    const conf = 'color=0,debug=0';
    zencode_exec(zencode, { data, keys, conf })
      .then((result) => {
        resolve(JSON.parse(result.result));
      })
      .catch((error) => {
		console.log(error);
        reject(error.message);
      });
  });
};
/* eslint-enable */

/**
 * Javascript Class to interact with Zenroom.
 */
module.exports = class W3C {
  /**
   * New Blockchain KeyPair.
   *
   * @returns {object} Key pair
   */
  static async newKeys(name) {
    return new Promise((resolve) => {
      const zencode = `
        Scenario 'ecdh': Create the keypair
        Given my name is in a 'string' named 'myName'
        When I create the keypair
        Then print my data`;
      zexecute(zencode, { myName: name }).then(resolve);
    });
  }

  /**
   * Verions
   *
   * @returns {object} Verion
   */
  static async version(name) {
    return new Promise((resolve) => {
      const zencode = 'print(VERSION)';
      zexecute(zencode, { myName: name }).then(resolve);
    });
  }

  /**
   * New Blockchain KeyPair.
   *
   * @returns {object} Key pair
   */
  static async getKeys(keys) {
    return keys;
  }

  static async signCredential(credential, key) {
    return new Promise((resolve, reject) => {
      const zencode = `
        Rule check version 1.0.0
        Scenario 'w3c' : sign
        Scenario 'ecdh' : keypair
        Given that I am 'Issuer'
        Given I have my 'keypair'
        Given I have a 'verifiable credential' named 'vc'
        Given I have a 'string' named 'PublicKeyUrl' inside 'Issuer'
        When I sign the verifiable credential named 'vc'
        When I set the verification method in 'vc' to 'PublicKeyUrl'
        Then print 'vc' as 'string'`;
      zexecute(zencode, { vc: credential }, key)
        .then((result) => {
          resolve(result.vc);
        })
        .catch(() => {
          reject();
        });
    });
  }

  static async verifyCredential(credential, publicKey) {
    return new Promise((resolve) => {
      const zencode = `
        Rule check version 1.0.0
        Scenario 'w3c' : verify w3c vc signature
        Scenario 'ecdh' : verify
        Given I have a 'public key' from 'Issuer'
        Given I have a 'verifiable credential' named 'vc'
        When I verify the verifiable credential named 'vc'
        Then print the string 'OK'`;
      const keys = {
        Issuer: {
          public_key: publicKey,
        },
      };
      zexecute(zencode, { vc: credential }, keys)
        .then((result) => {
          resolve(result.output[0] === 'OK');
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
};
