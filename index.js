const rp = require('request-promise-native');

class TPClient {
	constructor(credentials, ip) {
		this._credentials = credentials;
		this._ip = ip;
		this._baseUrl = `http://${ip}`;
	}

	get credentials() {
		return this._credentials;
	}

	get ip() {
		return this._ip;
	}

	buildOptions(endpoint, override) {
		const defaultOptions = {
			auth: {
				username: this._credentials.username,
				password: this._credentials.password
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
		const options = this.buildOptions('configuration.xml');
		return this.sendRequest('GET', options);
	}

	getCommands() {
		const options = this.buildOptions('command.xml');
		return this.sendRequest('GET', options);
	}

	getStatus() {
		const options = this.buildOptions('status.xml');
		return this.sendRequest('GET', options);
	}

	getValuespace() {
		const options = this.buildOptions('valuespace.xml');
		return this.sendRequest('GET', options);
	}

	getXml(locationPath) {
		const qs = {
			location: locationPath
		};
		const options = this.buildOptions('getxml', {
			qs
		});
		return this.sendRequest('GET', options);
	}

	putXml(payload) {
		const options = this.buildOptions('putxml', {
			method: 'POST',
			body: payload
		});
		return this.sendRequest('POST', options);
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

	sendRequest(requestType, options) {
		const requests = {
			GET: rp.get,
			POST: rp.post
		};

		return requests[requestType](options);
	}

}

module.exports = TPClient;
