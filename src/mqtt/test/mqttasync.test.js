/* eslint-disable global-require */
/* eslint-disable linebreak-style */
/* eslint-disable jest/no-disabled-tests */

'use strict';

const MQTTAsync = require('../async/mqtt.js');

const options = {
  hostname: 'localhost',
  port: 2883,
  protocol: 'mqtt',
  username: 'MyUserName',
  password: 'MySecretPassword',
  credential: 'MyCredential',
};

const myConnection = (connectData) => {
  console.log('Connected = %O', connectData);
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

const myConnection2 = (connectData) => {
  console.log('2) Connected = %O', connectData);
}

const myDisconnection2 = () => {
  console.log('2) Disconnecting!!!');
}

const myMessage2 = (topic, payload) => {
  console.log('2) This is the topic = %O and this is the data = %O', topic, payload.toString());
}

const myError2 = (error) => {
  console.log('2) This is an error = %O', error);
}

(async () => {
  const sub = new MQTTAsync(options);
  sub.handleConnect = myConnection;
  sub.handleMessage = myMessage;
  sub.handleError = myError;
  sub.handleDisconnect = myDisconnection;

  const client = await sub.connect();
  if (sub.client.connected) {
    console.log('Connected!!');
  }

  await sub.subscribe('vehicles/#');
 
  const pub = new MQTTAsync(options);
  pub.handleConnect = myConnection2;
  pub.handleMessage = myMessage2;
  pub.handleError = myError2;
  pub.handleDisconnect = myDisconnection2;
  await pub.connect();
  await pub.publish('vehicles/mycar/battery', 'battery full');
  
  await pub.disconnect()
  await sub.disconnect()
})();
