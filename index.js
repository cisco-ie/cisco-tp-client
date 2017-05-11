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

	buildOptions(method, endpoint, qs = {}) {
		const options = {
			auth: {
				username: this._credentials.username,
				password: this._credentials.password
			},
			method,
			uri: `${this._baseUrl}/${endpoint}`,
			headers: {
				'Content-Type': 'text/xml'
			},
			qs
		};

		return options;
	}

	getConfiguration() {
		const options = this.buildOptions('GET', 'configuration.xml');
		return this.sendRequest('GET', options);
	}

	getCommands() {
		const options = this.buildOptions('GET', 'command.xml');
		return this.sendRequest('GET', options);
	}

	getStatus() {
		const options = this.buildOptions('GET', 'status.xml');
		return this.sendRequest('GET', options);
	}

	getValuespace() {
		const options = this.buildOptions('GET', 'valuespace.xml');
		return this.sendRequest('GET', options);
	}

	getXml(locationPath) {
		const qs = {
			location: locationPath
		};
		const options = this.buildOptions('GET', 'getxml', qs);
		return this.sendRequest('GET', options);
	}

	putXml() {
		const options = this.buildOptions('POST', 'putxml');
		return this.sendRequest('POST', options);
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
