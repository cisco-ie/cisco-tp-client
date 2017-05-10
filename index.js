class TPClient {
	constructor(credentials) {
		this._credentials = credentials || {};
	}

	get credentials() {
		return this._credentials;
	}
}

module.exports = TPClient;
