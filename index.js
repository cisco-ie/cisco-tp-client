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

	buildOptions(method, endpoint) {
		const options = {
			auth: {
				username: this._credentials.username,
				password: this._credentials.password
			},
			method,
			uri: `${this._baseUrl}/${endpoint}`,
			headers: {
				'Content-Type': 'application/xml'
			}
		};

		return options;
	}

	getConfiguration() {
		const options = this.buildOptions('GET', 'configuration.xml');
		return rp.get(options);
	}

	getCommands() {
		const options = this.buildOptions('GET', 'command.xml');
		return rp.get(options);
	}
}

module.exports = TPClient;
