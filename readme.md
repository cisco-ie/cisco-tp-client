# cisco-tp-client [![Build Status](https://travis-ci.org/brh55/cisco-tp-client.svg?branch=master)](https://travis-ci.org/brh55/cisco-tp-client) [![Coverage Status](https://coveralls.io/repos/github/brh55/cisco-tp-client/badge.svg?branch=master)](https://coveralls.io/github/brh55/cisco-tp-client?branch=master)

> A Node.js API client for Cisco TelePresence endpoints/codecs

`cisco-tp-client` is a promise-based Node.js client library to interact with Cisco TelePresence endpoints/codecs *(DX Series, SX Series, EX Series)* HTTP supported APIs. In addition to the standard available APIs, it handles authentication, and HTTP feedback expressions. It is currently built on top of [`request`](https://github.com/request/request) and [`request-promise-native`](https://github.com/request/request-promise-native).

For more detailed information on API usage, visit the [Cisco Support page](http://www.cisco.com/c/en/us/support/index.html) for API reference guides for each series.

## Install

```
$ npm install --save cisco-tp-client
```

## Usage

```js
const ciscoTPClient = require('cisco-tp-client');

const sx20 = ciscoTpClient({
  username: 'brandon',
  password: 'password123'
}, '192.168.0.2');

sx20
  .getXml('/Status/Audio')
  .then(response => console.log); // sx20 Audio Status XML
```

## API

### ciscoTpClient(credentials, ip)

#### credentials

Required<br>
Type: `object`

##### credentials.username || credentials.user
The username for the TP unit

##### credentials.password || credentials.pass
The password for the TP unit

#### ip

Required<br>
Type: `string`

The IP address of the TP unit

## Client Properties

### credentials

Type: `Object`<br>

#### credentials.user
#### credentials.pass

The credentials passed in and is used for the request

### ip

Type: `String`<br>

The IP addressed passed into the client

### options

Type: `String`<br>

The last set of request options the client executed with. Can be useful for debugging.

## Client Methods

### getConfiguration()

Gets the complete Configuration XML document.

### getCommands()

Gets the complete Commands XML document.

### getStatus()

Gets the complete Status XML document.

### getValuespace()

Gets the complete Valuespace XML document.

### getXml(`XPath`)

Gets a subset of a XML document per specified `XPath`.

#### XPath
Required<br>
Type: `String`

The XPath of the XML Document. *(IE: `/Status/Camera`)*.

### putXml(`xmlDocument`)

Sets a particular setting by putting an XML document.

### putXmlWithForm(`xmlDocument`)

Similar to `.putXml`, but instead uses `www-url-form-encoded`. Generally used for better performance when settings are non-alphanumeric or small in nature.

#### xmlDocument
Required<br>
Type: `String` (XML)

An XML document to be put.

##### Example XML Document: Setting a System Name
```
<Configuration>
	<SystemUnit>
		<Name>newName</Name>
	</SystemUnit>
</Configuration>
```

#### setHttpFeedback(`settings`)

Sets an HTTP Feedback expression. These are feedback on events from the codec, which are posted to a specified `serverUrl` (AKA: webhook url) to monitor changes to a particular XPath

> **⚠️ Note**
>
> Do not register for `/Status` as this will lead to "unpreditable behavior and sluggish behavior."

##### Example: Setting Multiple Feedback Expressions
```
client
  .setHttpFeedback({
     feedbackSlot: 1,
     serverUrl: 'http://webhookUrl.com/test',
     expressions: [
       '/Event/CallDisconnect',
       '/Event/Reboot',
       '/Status/Call`
     ]
   })
   .then(success => console.log);
```

##### settings.feedbackSlot
Required<br>
Type: `int`<br>
The designated feedback slot to be used. 

> **⚠️ Note**
> 
> Avoid using Feedback Slot 3, when a Cisco TelePresence Management Suite (TMS) is used within the infrastructure.

##### settings.serverUrl
Required<br>
Type: `string`<br>
The url where the Codec will post the feedback to.

##### settings.expressions
Required<br>
Type: `Array`<br>
Constraints: Cannot be greater than 15
A set of feedback expressions, which monitor a particular XPath.

IE: `/Status/Call`, `/Status/Reboot`, etc

## License

MIT © [Brandon Him](https://github.com/cisco-ie/cisco-tp-client)
