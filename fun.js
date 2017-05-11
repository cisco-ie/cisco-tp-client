const CiscoTPClient = require('.');

const TP = new CiscoTPClient({
	username: 'mllewell',
	password: 'Cisco123!'
}, '10.88.56.186');

TP.putXml('/Status/Audio').then(response => console.log(response));
