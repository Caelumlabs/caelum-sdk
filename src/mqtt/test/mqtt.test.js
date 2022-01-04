/* eslint-disable global-require */
/* eslint-disable linebreak-style */
/* eslint-disable jest/no-disabled-tests */

'use strict';

const MQTT = require('../sync/mqtt.js');
// const MqttPublish = require('./publish.js');

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

options.topic = 'vehicle/#';
const sub = new MQTT(options);
sub.handleConnect = myConnection;
sub.handleMessage = myMessage;
sub.handleError = myError;
sub.handleDisconnect = myDisconnection;
const client = sub.connect();
sub.subscribe();
sub.subscribe('drone/data');

options.topic = 'vehicle/car01/gastank';
const pub = new MQTT(options);
pub.handleConnect = myConnection2;
pub.handleMessage = myMessage2;
pub.handleError = myError2;
pub.handleDisconnect = myDisconnection2;
pub.connect();
pub.publish();
const result2 = pub.publish('drone/data', 'Another message');
// pub.disconnect();
console.log(result2);
