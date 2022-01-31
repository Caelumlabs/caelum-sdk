/* eslint-disable global-require */
/* eslint-disable linebreak-style */
/* eslint-disable jest/no-disabled-tests */

'use strict';

const MQTTAsync = require('../async/mqtt.js');

const options = {
  hostname: 'broker.tabit.caelumapp.com',
  port: 443,
  protocol: 'wss',
  username: 'MyUserName',
  password: 'MySecretPassword', // This is optional
  credential: 'MyCredential',
};

let clientId = null
const myConnection = (connectData) => {
  console.log('Connected = %O', connectData);
  clientId =connectData.clientId
}

const myDisconnection = () => {
  console.log('Disconnecting!!!');
}

const myMessage = (topic, payload) => {
  console.log('This is the topic = %O and this is the data = %O', topic, payload.toString());
}

const myError = (error) => {
  console.log('This is an error = %O', error);
}

(async () => {
  const sub = new MQTTAsync(options);
  sub.handleConnect = myConnection;
  sub.handleMessage = myMessage;
  sub.handleError = myError;
  sub.handleDisconnect = myDisconnection;

  const client = await sub.connect();

  await sub.subscribe('infra/#');
  const topic = 'vehicles/' + clientId +'/battery'
  await sub.publish(topic, 'start');
  
  // simulate wait time to receive several messages 
  setTimeout(async () => {
    await sub.publish(topic, 'full');
    await sub.disconnect()
  }, 40000)

})();
