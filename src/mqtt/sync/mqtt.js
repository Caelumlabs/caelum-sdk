/* eslint-disable no-await-in-loop */
/* eslint-disable no-multi-spaces */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
const mqtt = require('mqtt')

/**
 * Javascript Class to MQTT topic subscribe.
 */
module.exports = class MQTT {
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

    // Handlers
    this.handleConnect = () => {};
    this.handleDisconnect = () => {};
    this.handleMessage = () => {};
    this.handleError = () => {};
  }

  // MQTT execution related functions

  /**
   * Connect with the MQTT Server/Broker.
   *
   * @returns {boolean} success
   */
  connect() {
    if (this.args.credential) {
      this.args.username = '';
      this.args.password = this.args.credential;
    }
    this.client = mqtt.connect(this.args);
    this.client.on('connect', () => {
      const data = {
        hostname: this.client.options.hostname,
        port: this.client.options.port,
        clientId: this.client.options.clientId,
        username: this.client.options.username,
      }
      this.handleConnect(data); 
      this.isConnected = true;
    });
    this.client.on('message', (topic, payload) => {
      this.handleMessage(topic, payload);
    })
    this.client.on('end', () => { 
      this.handleDisconnect(); 
      this.isConnected = false;
    });
    this.client.on('error', (e) => { 
      this.handleError(e); 
      this.client.end();
      this.isConnected = false;
    });
  }

  /**
   * Disconnect.
   *
   * @returns {boolean} success
   */
  disconnect() {
    this.client.end();
  }

  /**
   * Subscribe to a MQTT topic.
   *
   * @returns {boolean} success
   */
  subscribe(topic) {
    const subTopic = topic || this.args.topic;

    this.client.subscribe(subTopic, { qos: this.args.qos }, (err, result) => {
      if (err) {
        console.log(err);
      }
      result.forEach((sub) => {
        if (sub.qos > 2) {
          console.log('subscription negated to', sub.topic, 'with code', sub.qos);
        }
      });
    });
  }

  /**
   * Unsubscribe from an MQTT topicr.
   *
   * @returns {boolean} success
   */
  unsubscribe(topic) {
    const subTopic = topic || this.args.topic;

    this.client.unsubscribe(subTopic);
  }

  /**
   * Send message to MQTT topic.
   *
   * @returns {boolean} success
   */
  send(topic, message) {
    this.client.publish(topic, message, this.args, (err) => {
      if (err) {
        console.log(err);
      }
      // this.client.end();
    });
  }

  /**
   * Send multiple messages to MQTT topic.
   *
   * @returns {boolean} success
   */
  multisend(topic, message) {
    message.forEach((msg) => {
      this.client.publish(topic, msg, this.args, (err) => {
        if (err) {
          console.log(err);
        }
        // this.client.end();
      });
    });
  }

  /**
   * Connect and send multiple messages to MQTT topic.
   *
   * @returns {boolean} success
   */
  publish(topic, message) {
    let retries = this.args.maxRetries;
    // while (!this.isConnected && retries > 0) {
    //   retries -= 1;
    //   await this.delay();
    // };
    const pubTopic = topic || this.args.topic;
    const pubMessage = message || this.args.message;

    if (this.args.multiline) {
      this.multisend(pubTopic, pubMessage);
    } else {
      this.send(pubTopic, pubMessage);
    };
  }

  /**
   * Help function for delayr.
   *
   * @returns {boolean} success
   */
  delay(n) {
    const d = n || 2000;
    return new Promise(ok => {
      setTimeout(() => {
        ok();
      }, d);
    });
  }
};
