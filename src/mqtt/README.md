MQTT.js is a client library for the [MQTT](http://mqtt.org/) protocol, written
in JavaScript for node.js and the browser.

## Table of Contents
* [Examples](#examples)
* [API](#api)
* [About QoS](#qos)
* 
<a name="examples"></a>
## Examples

There are two kind of uses, either Synchronous or Asynchronous:

Synchronous Subscriber

```js
const MQTT = require('../sync/mqtt.js');

const options = {
  hostname: 'localhost',
  port: 1883,
  username: 'MyUserName',
  password: 'MySecretPassword',
  credential: 'MyCredential',
};

const useOnConnection = (connectData) => {
  console.log('Connected = ', connectData);
}

const useOnDisconnection = () => {
  console.log('Disconnecting!!!');
}

const useOnMessage = (topic, payload) => {
  console.log('Topic = %O , Payload = %O', topic, payload.toString());
}

const useOnError = (error) => {
  console.log('This is an error = ', error);
}

options.topic = 'topic/subtopic/data';
const sub = new MQTT(options);

// Assign function handlers
sub.handleConnect = useOnConnection;
sub.handleMessage = useOnMessage;
sub.handleError = useOnError;
sub.handleDisconnect = useOnDisconnection;

// Connect
const client = sub.connect();
// Subscribe to topic
sub.subscribe('topic/subtopic/data');
```

Synchronous Publisher

```js
const MQTT = require('../sync/mqtt.js');

const options = {
  hostname: 'localhost',
  port: 1883,
  username: 'MyUserName',
  password: 'MySecretPassword',
  credential: 'MyCredential',
};

const useOnConnection = (connectData) => {
  console.log('Connected = ', connectData);
}

const useOnDisconnection = () => {
  console.log('Disconnecting!!!');
}

const useOnError = (error) => {
  console.log('This is an error = ', error);
}

const pub = new MQTT(options);

// Assign function handlers
pub.handleConnect = useOnConnection;
pub.handleError = useOnError;
pub.handleDisconnect = useOnDisconnection;

// Connect
const client = pub.connect();
// Publish message to topic
pub.publish('topic/subtopic/data', 'Some important message');
pub.disconnect();

```

Asynchronous Subscriber

```js
const MQTTAsync = require('../async/mqtt.js');

const options = {
  hostname: 'localhost',
  port: 1883,
  username: 'MyUserName',
  password: 'MySecretPassword',
  credential: 'MyCredential',
};

const useOnConnection = (connectData) => {
  console.log('Connected = ', connectData);
}

const useOnDisconnection = () => {
  console.log('Disconnecting!!!');
}

const useOnMessage = (topic, payload) => {
  console.log('Topic = %O , Payload = %O', topic, payload.toString());
}

const useOnError = (error) => {
  console.log('This is an error = ', error);
}

options.topic = 'topic/subtopic/data';
const sub = new MQTTAsync(options);

// Assign function handlers
sub.handleConnect = useOnConnection;
sub.handleMessage = useOnMessage;
sub.handleError = useOnError;
sub.handleDisconnect = useOnDisconnection;

// Connect
const client = await sub.connect();
// Subscribe to topic
await sub.subscribe('topic/subtopic/data');
```

Asynchronous Publisher

```js
const MQTTAsync = require('../async/mqtt.js');

const options = {
  hostname: 'localhost',
  port: 1883,
  username: 'MyUserName',
  password: 'MySecretPassword',
  credential: 'MyCredential',
};

const useOnConnection = (connectData) => {
  console.log('Connected = ', connectData);
}

const useOnDisconnection = () => {
  console.log('Disconnecting!!!');
}

const useOnError = (error) => {
  console.log('This is an error = ', error);
}

const pub = new MQTT(options);

// Assign function handlers
pub.handleConnect = useOnConnection;
pub.handleError = useOnError;
pub.handleDisconnect = useOnDisconnection;

// Connect
const client = await pub.connect();
await pub.publish('topic/subtopic/data', 'Some important message');
await pùb.disconnect();
```

<a name="classBuilder"></a>
### new MQTTClass(options)

The `MQTT Client` class wraps a client connection to an
MQTT broker over an arbitrary transport method (TCP, TLS,
WebSocket, ecc).

`MQTT Client` automatically handles the following:

* Regular server pings
* QoS flow
* Automatic reconnections
* Start publishing before being connected

The arguments are:

* `options` is the client connection options. Defaults:
  * `wsOptions`: is the WebSocket connection options. Default is `{}`.
     It's specific for WebSockets. For possible options have a look at: https://github.com/websockets/ws/blob/master/doc/ws.md.
  * `keepalive`: `60` seconds, set to `0` to disable
  * `reschedulePings`: reschedule ping messages after sending packets (default `true`)
  * `clientId`: `'mqttjs_' + Math.random().toString(16).substr(2, 8)`
  * `protocolId`: `'MQTT'`
  * `protocolVersion`: `4`
  * `clean`: `true`, set to false to receive QoS 1 and 2 messages while offline
  * `reconnectPeriod`: `1000` milliseconds, interval between two reconnections. Disable auto reconnect by setting to `0`.
  * `connectTimeout`: `30 * 1000` milliseconds, time to wait before a CONNACK is received
  * `username`: the username required by your broker, if any
  * `password`: the password required by your broker, if any
  * `incomingStore`: a [Store](#store) for the incoming packets
  * `outgoingStore`: a [Store](#store) for the outgoing packets
  * `queueQoSZero`: if connection is broken, queue outgoing QoS zero messages (default `true`)
  * `customHandleAcks`: MQTT 5 feature of custom handling puback and pubrec packets. Its callback:
      ```js
        customHandleAcks: function(topic, message, packet, done) {/*some logic wit colling done(error, reasonCode)*/}
      ```
  * `autoUseTopicAlias`: enabling automatic Topic Alias using functionality
  * `autoAssignTopicAlias`: enabling automatic Topic Alias assign functionality
  * `properties`: properties MQTT 5.0.
  `object` that supports the following properties:
    * `sessionExpiryInterval`: representing the Session Expiry Interval in seconds `number`,
    * `receiveMaximum`: representing the Receive Maximum value `number`,
    * `maximumPacketSize`: representing the Maximum Packet Size the Client is willing to accept `number`,
    * `topicAliasMaximum`: representing the Topic Alias Maximum value indicates the highest value that the Client will accept as a Topic Alias sent by the Server `number`,
    * `requestResponseInformation`: The Client uses this value to request the Server to return Response Information in the CONNACK `boolean`,
    * `requestProblemInformation`: The Client uses this value to indicate whether the Reason String or User Properties are sent in the case of failures `boolean`,
    * `userProperties`: The User Property is allowed to appear multiple times to represent multiple name, value pairs `object`,
    * `authenticationMethod`: the name of the authentication method used for extended authentication `string`,
    * `authenticationData`: Binary Data containing authentication data `binary`
  * `authPacket`: settings for auth packet `object`
  * `will`: a message that will sent by the broker automatically when
     the client disconnect badly. The format is:
    * `topic`: the topic to publish (Usually included either in the subscribe or publish function call)
    * `payload`: the message to publish. (Usually included in the publish function call)
    * `qos`: the QoS
    * `retain`: the retain flag
    * `properties`: properties of will by MQTT 5.0:
      * `willDelayInterval`: representing the Will Delay Interval in seconds `number`,
      * `payloadFormatIndicator`: Will Message is UTF-8 Encoded Character Data or not `boolean`,
      * `messageExpiryInterval`: value is the lifetime of the Will Message in seconds and is sent as the Publication Expiry Interval when the Server publishes the Will Message `number`,
      * `contentType`: describing the content of the Will Message `string`,
      * `responseTopic`: String which is used as the Topic Name for a response message `string`,
      * `correlationData`: The Correlation Data is used by the sender of the Request Message to identify which request the Response Message is for when it is received `binary`,
      * `userProperties`: The User Property is allowed to appear multiple times to represent multiple name, value pairs `object`
  * `transformWsUrl` : optional `(url, options, client) => url` function
        For ws/wss protocols only. Can be used to implement signing
        urls which upon reconnect can have become expired.
  * `resubscribe` : if connection is broken and reconnects,
     subscribed topics are automatically subscribed again (default `true`)
  * `messageIdProvider`: custom messageId provider. when `new UniqueMessageIdProvider()` is set, then non conflict messageId is provided.

In case mqtts (mqtt over tls) is required, the `options` object is
passed through to
[`tls.connect()`](http://nodejs.org/api/tls.html#tls_tls_connect_options_callback).
If you are using a **self-signed certificate**, pass the `rejectUnauthorized: false` option.
Beware that you are exposing yourself to man in the middle attacks, so it is a configuration
that is not recommended for production environments.

#### Event `'connect'`

`function (connack) {}`

Emitted on successful (re)connection (i.e. connack rc=0).
* `connack` received connack packet. When `clean` connection option is `false` and server has a previous session
for `clientId` connection option, then `connack.sessionPresent` flag is `true`. When that is the case,
you may rely on stored session and prefer not to send subscribe commands for the client.

#### Event `'reconnect'`

`function () {}`

Emitted when a reconnect starts.

#### Event `'close'`

`function () {}`

Emitted after a disconnection.

#### Event `'disconnect'`

`function (packet) {}`

Emitted after receiving disconnect packet from broker. MQTT 5.0 feature.

#### Event `'offline'`

`function () {}`

Emitted when the client goes offline.

#### Event `'error'`

`function (error) {}`

Emitted when the client cannot connect (i.e. connack rc != 0) or when a
parsing error occurs.

The following TLS errors will be emitted as an `error` event:

* `ECONNREFUSED`
* `ECONNRESET`
* `EADDRINUSE`
* `ENOTFOUND`

#### Event `'end'`

`function () {}`

Emitted when <a href="#end"><code>mqtt.Client#<b>end()</b></code></a> is called.

#### Event `'message'`

`function (topic, message, packet) {}`

Emitted when the client receives a publish packet
* `topic` topic of the received packet
* `message` payload of the received packet
* `packet` received packet, as defined in

#### Event `'packetsend'`

`function (packet) {}`

Emitted when the client sends any packet. This includes .published() packets
as well as packets used by MQTT for managing subscriptions and connections
* `packet` received packet, as defined in
  [mqtt-packet](https://github.com/mcollina/mqtt-packet)

#### Event `'packetreceive'`

`function (packet) {}`

Emitted when the client receives any packet. This includes packets from
subscribed topics as well as packets used by MQTT for managing subscriptions
and connections
* `packet` received packet, as defined in
  [mqtt-packet](https://github.com/mcollina/mqtt-packet)

-------------------------------------------------------
<a name="publish"></a>
### mqtt#publish(topic, message, [options], [callback])

Publish a message to a topic

* `topic` is the topic to publish to, `String`
* `message` is the message to publish, `Buffer` or `String`
* `options` is the options to publish with, including:
  * `qos` QoS level, `Number`, default `0`
  * `retain` retain flag, `Boolean`, default `false`
  * `dup` mark as duplicate flag, `Boolean`, default `false`
  * `properties`: MQTT 5.0 properties `object`
    * `payloadFormatIndicator`: Payload is UTF-8 Encoded Character Data or not `boolean`,
    * `messageExpiryInterval`: the lifetime of the Application Message in seconds `number`,
    * `topicAlias`: value that is used to identify the Topic instead of using the Topic Name `number`,
    * `responseTopic`: String which is used as the Topic Name for a response message `string`,
    * `correlationData`: used by the sender of the Request Message to identify which request the Response Message is for when it is received `binary`,
    * `userProperties`: The User Property is allowed to appear multiple times to represent multiple name, value pairs `object`,
    * `subscriptionIdentifier`: representing the identifier of the subscription `number`,
    * `contentType`: String describing the content of the Application Message `string`
  * `cbStorePut` - `function ()`, fired when message is put into `outgoingStore` if QoS is `1` or `2`.
* `callback` - `function (err)`, fired when the QoS handling completes,
  or at the next tick if QoS 0. An error occurs if client is disconnecting.

-------------------------------------------------------
<a name="subscribe"></a>
### mqtt#subscribe(topic/topic array/topic object, [options], [callback])

Subscribe to a topic or topics

* `topic` is a `String` topic to subscribe to or an `Array` of
  topics to subscribe to. It can also be an object, it has as object
  keys the topic name and as value the QoS, like `{'test1': {qos: 0}, 'test2': {qos: 1}}`.
  MQTT `topic` wildcard characters are supported (`+` - for single level and `#` - for multi level)
* `options` is the options to subscribe with, including:
  * `qos` QoS subscription level, default 0
  * `nl` No Local MQTT 5.0 flag (If the value is true, Application Messages MUST NOT be forwarded to a connection with a ClientID equal to the ClientID of the publishing connection)
  * `rap` Retain as Published MQTT 5.0 flag (If true, Application Messages forwarded using this subscription keep the RETAIN flag they were published with. If false, Application Messages forwarded using this subscription have the RETAIN flag set to 0.)
  * `rh` Retain Handling MQTT 5.0 (This option specifies whether retained messages are sent when the subscription is established.)
  * `properties`: `object`
    * `subscriptionIdentifier`:  representing the identifier of the subscription `number`,
    * `userProperties`: The User Property is allowed to appear multiple times to represent multiple name, value pairs `object`
* `callback` - `function (err, granted)`
  callback fired on suback where:
  * `err` a subscription error or an error that occurs when client is disconnecting
  * `granted` is an array of `{topic, qos}` where:
    * `topic` is a subscribed to topic
    * `qos` is the granted QoS level on it

-------------------------------------------------------
<a name="unsubscribe"></a>
### mqtt#unsubscribe(topic/topic array, [options], [callback])

Unsubscribe from a topic or topics

* `topic` is a `String` topic or an array of topics to unsubscribe from
* `options`: options of unsubscribe.
  * `properties`: `object`
      * `userProperties`: The User Property is allowed to appear multiple times to represent multiple name, value pairs `object`
* `callback` - `function (err)`, fired on unsuback. An error occurs if client is disconnecting.

-------------------------------------------------------
<a name="end"></a>
### mqtt#end([force], [options], [callback])

Close the client, accepts the following options:

* `force`: passing it to true will close the client right away, without
  waiting for the in-flight messages to be acked. This parameter is
  optional.
* `options`: options of disconnect.
  * `reasonCode`: Disconnect Reason Code `number`
  * `properties`: `object`
    * `sessionExpiryInterval`: representing the Session Expiry Interval in seconds `number`,
    * `reasonString`: representing the reason for the disconnect `string`,
    * `userProperties`: The User Property is allowed to appear multiple times to represent multiple name, value pairs `object`,
    * `serverReference`: String which can be used by the Client to identify another Server to use `string`
* `callback`: will be called when the client is closed. This parameter is
  optional.

-------------------------------------------------------
<a name="connected"></a>
### mqtt.Client#connected

Boolean : set to `true` if the client is connected. `false` otherwise.
