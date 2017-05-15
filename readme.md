# cisco-tp-client  [![Build Status](https://img.shields.io/travis/cisco-ie/cisco-tp-client.svg?style=flat-square)](https://travis-ci.org/brh55/cisco-tp-client) [![Coverage Status](https://img.shields.io/coveralls/brh55/cisco-tp-client/master.svg?style=flat-square)](https://coveralls.io/github/brh55/cisco-tp-client?branch=master) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)


> A Node.js API client for Cisco TelePresence endpoints/codecs

`cisco-tp-client` is a promise-based Node.js client library to interact with Cisco TelePresence endpoints/codecs *(DX Series, SX Series, EX Series)* HTTP supported APIs. In addition to the standard available APIs, it handles authentication, and HTTP feedback expressions. It is currently built on top of [`request`](https://github.com/request/request) and [`request-promise-native`](https://github.com/request/request-promise-native).

For detailed information regarding genral API codec usage, visit the [Cisco Support page](http://www.cisco.com/c/en/us/support/index.html) for API reference guides for each series.

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

| Properties       | Type     | Description                  |
|------------------|----------|------------------------------|
| username OR user | `string` | The username for the TP unit |
| password OR pass | `string`  | The password for the TP unit |

#### ip

Required<br>
Type: `string`

The IP address of the TP unit

## Client Properties

### credentials

Type: `Object`<br>
Props: `user` and `pass`

The credentials passed in and is used for the request. 

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

### setHttpFeedback(`settings`)

Sets an HTTP Feedback expression. These are feedback on events from the codec, which are posted to a specified `serverUrl` (AKA: webhook url) to monitor changes to a particular XPath

#### settings

| Properties   | Type     | Description                                                       | Example                              |
|--------------|----------|-------------------------------------------------------------------|--------------------------------------|
| feedbackSlot | `int` [1..4] | The designated feedback slot to be used.                          | `1`                                  |
| serverUrl    | `string` | The url where the Codec will post the feedback to.                | `http://yourwebhook.com/feedback`    |
| expressions  | `array`  | A set of feedback expressions, which monitor a particular XPath.  | `['/Status/Call', '/Status/Reboot']` |

> **⚠️ Note - feedbackSlot**
> 
> Avoid using Feedback Slot 3, when a Cisco TelePresence Management Suite (TMS) is used within the infrastructure.


> **🚫 Constraints - expressions**
> 
> - Codecs are only limited to 15 expressions per a slot. 
> - Do not register for `/Status` as this will lead to "unpreditable behavior and sluggish behavior."


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

## Authors
- [Brandon Him - :octocat: brh55](https://github.com/brh55/)
- [Anush Ganapathi Agraharam Sivasankar - :octocat: anushramsurat1](https://github.com/anushramsurat1)

## Contribute
Pull requests are welcomed and encouraged, please feel free to submit any issues on bugs, feature enhancements, etc. PRs should include associated unit-test and pass code style requirements. Therefore, for all PRs please run `$ npm test` or the CI will fail. 

Do not hesistate to ask 🙃!

## License

MIT © [Cisco Innovation Edge](https://github.com/cisco-ie/cisco-tp-client)
