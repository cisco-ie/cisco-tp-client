const rp = require('request-promise-native');

class TPClient {
	constructor({username, user, password, pass}, ip) {
		// Allow both options, but set the default keys
		// to match with Request.credentials (user, pass)
		this._credentials = {
			user: user || username,
			pass: pass || password
		};
		this._ip = ip;
		this._baseUrl = `http://${ip}`;
	}

	get credentials() {
		return this._credentials;
	}

	get ip() {
		return this._ip;
	}

	get options() {
		return this._options;
	}

	buildOptions(endpoint, override) {
		const defaultOptions = {
			auth: {
				user: this._credentials.user,
				pass: this._credentials.pass
			},
			method: 'GET',
			uri: `${this._baseUrl}/${endpoint}`,
			headers: {
				'Content-Type': 'text/xml'
			}
		};

		return Object.assign({}, defaultOptions, override);
	}

	getConfiguration() {
		this._options = this.buildOptions('configuration.xml');

		return this.sendRequest('GET');
	}

	getCommands() {
		this._options = this.buildOptions('command.xml');

		return this.sendRequest('GET');
	}

	getStatus() {
		this._options = this.buildOptions('status.xml');

		return this.sendRequest('GET');
	}

	getValuespace() {
		this._options = this.buildOptions('valuespace.xml');

		return this.sendRequest('GET');
	}

	getXml(locationPath) {
		const qs = {
			location: locationPath
		};
		this._options = this.buildOptions('getxml', {
			qs
		});

		return this.sendRequest('GET');
	}

	putXml(payload) {
		if (!payload) {
			throw new Error('Payload parameter not defined');
		}

		this._options = this.buildOptions('putxml', {
			method: 'POST',
			body: payload
		});

		return this.sendRequest('POST');
	}

	putXmlWithForm(payload) {
		if (!payload) {
			throw new Error('Payload parameter not defined');
		}

		this._options = this.buildOptions('formputxml', {
			method: 'POST',
			qs: {
				xmldoc: payload
			},
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		return this.sendRequest('POST');
	}

	setHttpFeedback({serverUrl, expressions = [], feedbackSlot}) {
		if (!serverUrl || !feedbackSlot) {
			throw new Error('One or more required parameters are not defined');
		}
		if (expressions.length === 0) {
			throw new Error('No feedback expressions are defined');
		}
		if (expressions.length > 15) {
			throw new Error('Length of expressions cannot be greater than 15');
		}

		const expressionXML = expressions
			.map((expression, index) => `<Expression item="${index + 1}">${expression}</Expression>`)
			.toString();

		const feedbackXml = `
<Command>
<HttpFeedback>
<Register command="True">
<FeedbackSlot>${feedbackSlot}</FeedbackSlot>
<ServerUrl>${serverUrl}</ServerUrl>
${expressionXML}
</Register>
</HttpFeedback>
</Command>`;

		return this.putXml(feedbackXml);
	}

	sendRequest(requestType) {
		const requests = {
			GET: rp.get,
			POST: rp.post
		};

		return requests[requestType](this._options);
	}
}

module.exports = TPClient;
