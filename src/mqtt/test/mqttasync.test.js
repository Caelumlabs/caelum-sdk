/* eslint-disable global-require */
/* eslint-disable linebreak-style */
/* eslint-disable jest/no-disabled-tests */

'use strict';

const MQTTAsync = require('../async/mqtt.js');

const options = {
  hostname: 'localhost',
  port: 1883,
  topic: 'vehicle/ca01/gas',
  message: 'This is a content message',
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
  options.topic = 'vehicle/#';
  const sub = new MQTTAsync(options);
  sub.handleConnect = myConnection;
  sub.handleMessage = myMessage;
  sub.handleError = myError;
  sub.handleDisconnect = myDisconnection;

  const client = await sub.connect();
  if (sub.client.connected) {
    console.log('Connected!!');
  }

  await sub.subscribe();
  await sub.subscribe('idspace/data');

  options.topic = 'vehicle/car01/gastank';
  const pub = new MQTTAsync(options);
  pub.handleConnect = myConnection2;
  pub.handleMessage = myMessage2;
  pub.handleError = myError2;
  pub.handleDisconnect = myDisconnection2;
  await pub.connect();
  await pub.publish();
  await pub.publish('idspace/data', 'Another message');
  await pub.disconnect();
  await sub.disconnect();
})();
