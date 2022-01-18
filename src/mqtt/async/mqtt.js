/* eslint-disable no-await-in-loop */
/* eslint-disable no-multi-spaces */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const mqtt = require('./asyncmqtt.js');

const { AsyncClient } = mqtt;

/**
 * Javascript Class to MQTT topic subscribe.
 */
module.exports = class MQTTAsync {
  /**
   * Constructor
   *
   * @param {string} options Options for connection an interaction
   */
  constructor(options) {
    this.args = {};
    this.args.hostname = options.hostname || 'localhost';                             // Server/Broker host
    this.args.port = options.port || 1883;                                            // Server/Broker port
    this.args.clientId = options.clientId || null;                                    // Client id
    this.args.qos = options.qos || 0;                                                 // QoS of the message
    this.args.clean = options.clean || true;                                          // Discard (do/dont) any pending message for the given id
    this.args.topic = options.topic || null;                                          // Message topic
    this.args.message = options.message || null;                                      // Message
    this.args.keepAlive = options.keepAlive || 30;                                    // Send a ping every SEC seconds
    this.args.username = options.username || null;                                    // User Name
    this.args.password = options.password || null;                                    // Password
    this.args.credential = options.credential || null;                                // Credential
    this.args.protocol = options.protocol || 'mqtt';                                  // Protocol to use, 'mqtt', 'mqtts', 'ws' or 'wss'
    this.args.protocolVersion = options.protocolVersion || 4;                         // Protocol version
    this.args.key = options.key || null;                                              // Key
    this.args.cert = options.cert || null;                                            // Cert
    this.args.ca = options.ca || null;                                                // CA Certificate
    this.args.rejectUnauthorized = options.rejectUnauthorized || true;                // Do/Dont verify the server certificate
    this.args.will = {};
    this.args.will.topic = options.willTopic || 'willClose';                          // Will Topic
    this.args.will.payload = options.willPayload || 'willPayload';                    // Will Message
    this.args.will.qos = options.willQos || 0;                                        // 0/1/2   Will QoS
    this.args.will.retain = options.willRetain || 0;                                  // Send a will retained message

    this.args.multiline = options.multiline || false;                                 // Is a multi line message
    this.args.maxRetries = options.maxRetries || 5;                                   // Max number of retries

    if (options.key && options.cert && !options.protocol) {
      this.args.protocol = 'mqtts';
    }

    this.client = null;
    this.isConnected = false;

    // Event Handlers
    this.handleConnect = () => {};
    this.handleDisconnect = () => {};
    this.handleMessage = () => {};
    this.handleError = () => {};
  }

  // MQTT asynchronous execution of related functions

  /**
   * Connect with the MQTT Server/Broker.
   *
   * @returns {object} MQTT Client object
   */
  async connect() {
    if (this.args.credential) {
      this.args.username = 'GrandUsername';
      this.args.password = this.args.credential;
    }

    this.client = await mqtt.connect(this.args);
    this.client.on('connect', async () => { 
      const data = {
        hostname: this.client._client.options.hostname,
        port: this.client._client.options.port,
        clientId: this.client._client.options.clientId,
        username: this.client._client.options.username,
      }
      await this.handleConnect(data); 
      this.isConnected = true;
    });
    this.client.on('message', async (topic, payload) => {
      await this.handleMessage(topic, payload);
    })
    this.client.on('end', async () => { 
      await this.handleDisconnect(); 
      this.isConnected = false;
    });
    this.client.on('error', async (e) => { 
      await this.handleError(e); 
      await this.client.end();
      this.isConnected = false;
    });

    return this.client;
  }

  /**
   * Disconnect from server/broker.
   *
   * @returns {boolean} success
   */
  async disconnect() {
    await this.client.end();
  }

  /**
   * Subscribe to a topic or an array of topics.
   *
   * @param {array/string} topic Topic or array of topics.
   * @returns {boolean} success
   */
  async subscribe(topic) {
    const subTopic = topic || this.args.topic;

    let result;
    try {
      result = await this.client.subscribe(subTopic, { qos: 3 });      // this.args.qos
    } catch (err) {
      console.log(err);
    }

    result.forEach((sub) => {
      if (sub.qos > 2) {
        console.log('subscription negated to', sub.topic, 'with code', sub.qos);
      }
    });
  }

  /**
   * Unsubscribe from an MQTT topic or array of topics.
   *
   * @param {array/string} topic Topic or array of topics.
   */
  async unsubscribe(topic) {
    const subTopic = topic || this.args.topic;

    await this.client.unsubscribe(subTopic);
  }

  /**
   * Send message to MQTT topic.
   *
   * @param {arrays/string} topic Topic or array of topics.
   * @param {string} message Message to send.
   */
  async send(topic, message) {
    await this.client.publish(topic, message)
      .catch ((err) => {
        console.log(err);
      // this.client.end();
      });
  }

  /**
   * Send multiple messages to MQTT topic.
   *
   * @param {arrays/string} topic Topic or array of topics.
   * @param {string} message Message to send.
   */
  async multisend(topic, message) {
    message.forEach(async (msg) => {
      await this.client.publish(topic, msg, this.args)
        .catch ((err) => {
          console.log(err);
        // this.client.end();
        });
    });
  }

  /**
   * Connect and send multiple messages to MQTT topic.
   *
   * @param {arrays/string} topic Topic or array of topics.
   * @param {string} message Message to send.
   */
  async publish(topic, message) {
    const pubTopic = topic || this.args.topic;
    const pubMessage = message || this.args.message;

    if (this.args.multiline) {
      await this.multisend(pubTopic, pubMessage);
    } else {
      await this.send(pubTopic, pubMessage);
    };
  }
};
