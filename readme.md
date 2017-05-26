# cisco-tp-client   [![Build Status](https://img.shields.io/travis/cisco-ie/cisco-tp-client.svg?style=flat-square)](https://travis-ci.org/brh55/cisco-tp-client) [![Coverage Status](https://img.shields.io/coveralls/brh55/cisco-tp-client/master.svg?style=flat-square)](https://coveralls.io/github/brh55/cisco-tp-client?branch=master) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)


> A Node.js API client for Cisco TelePresence endpoints/codecs

`cisco-tp-client` is a promise-based Node.js client library to interact with Cisco TelePresence endpoints/codecs *(DX Series, SX Series, EX Series)* HTTP supported APIs. In addition to the standard available APIs, it handles authentication, and HTTP feedback expressions. It is currently built on top of [`request`](https://github.com/request/request) and [`request-promise-native`](https://github.com/request/request-promise-native).

For detailed information regarding general API codec usage, visit the [Cisco Support page](http://www.cisco.com/c/en/us/support/index.html) for API reference guides on each series.

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

The credentials passed in, which are used for the request to authenticate with.

### ip

Type: `String`<br>

The IP address where request are being made to.

### lastOptions

Type: `Object`<br>

The last set of request options the client has executed with, this can be useful for debugging purposes.

## Client Methods

### getConfiguration()

Get the complete Configuration XML document.

### getCommands()

Get the complete Commands XML document.

### getStatus()

Get the complete Status XML document.

### getValuespace()

Get the complete Valuespace XML document.

### getXml(`XPath`)

Get a subset of a XML document per specified `XPath`.

#### XPath
Required<br>
Type: `String`

The XPath of the XML Document. *(IE: `/Status/Camera`)*.
`NOTE: Logic for prepending slash added - if the XPath does not already contain a slash, it is prepended to the XPath. `

### putXml(`xmlDocument`)

Set a particular setting by putting an XML document.

### putXmlWithForm(`xmlDocument`)

Similar to `.putXml()`, but instead uses a `www-url-form-encoded` as the content-type. This is generally used for better performance when the xmlDocs are non-alphanumeric or small in nature.

#### xmlDocument
Required<br>
Type: `String` (XML)

The XML document to be put.

##### Example XML Document: Setting a System Name
```
<Configuration>
	<SystemUnit>
		<Name>newName</Name>
	</SystemUnit>
</Configuration>
```

### setHttpFeedback(`settings`)

Set a HTTP feedback notification to monitor a particular XPath. The notifications are posted to the specified `serverUrl` *(AKA: a webhook url)* that are set within the settings parameter.

`Format Parameter supported for CE < Version 9.0`

#### settings
| Properties   | Type                      | Description                                                      | Example                              |
|--------------|---------------------------|------------------------------------------------------------------|--------------------------------------|
| feedbackSlot | `int` [1..4]              | The designated feedback slot to be used.                         | `1`                                  |
| serverUrl    | `string`                  | The url where the Codec will post the feedback to.               | `http://yourwebhook.com/feedback`    |
| expressions  | `array`                   | A set of feedback expressions, which monitor a particular XPath. | `['/Status/Call', '/Status/Reboot']` |
| format       | `string` <br> ["xml" OR "json"] | The return format of the HTTP feedback payload                   | `'json'`                             |

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

### unsetHttpFeedback(`feedbackSlot`)

Unsets/unregister any HTTP feedback on a particular feedback slot.

#### feedbackSlot
Type: `int`

A slot to unregister the feedback expressions.

## Authors
- [Rekha Rawat - :octocat: rekharawat](https://github.com/rekharawat/)
- [Brandon Him - :octocat: brh55](https://github.com/brh55/)
- [Anush Ganapathi Agraharam Sivasankar - :octocat: anushramsurat1](https://github.com/anushramsurat1)

## Related Modules
- [tp-bulk-feedback](https://github.com/cisco-ie/tp-bulk-feedback) - A plugin for cisco-tp-client to set HTTP Feedback expressions on a list of TelePresence units with CLI support and local file.
- [tp-json-formatter](https://github.com/cisco-ie/tp-json-formatter) - A module that formats HTTP Feedback JSON responses from Cisco TelePresence units in a simpler, flatter JSON format.

## Contribute
Pull requests are welcomed and encouraged, please feel free to submit any issues on bugs, feature enhancements, etc. PRs should include associated unit-test and pass all code style requirements. Therefore, for all PRs should run `$ npm test` prior to submissions.

Please do not hesistate to reach out for help 🙃!

## License

MIT © [Cisco Innovation Edge](https://github.com/cisco-ie/cisco-tp-client)
