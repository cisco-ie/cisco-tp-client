import test from 'ava';
import nock from 'nock';
import CiscoTPClient from '.';

const IP = '192.168.0.1';
const BASE_NOCK = nock(`http://${IP}`);

const client = new CiscoTPClient({
	username: 'username',
	password: 'password'
}, IP);

test('Set credentials', t => {
	t.is(client.credentials.username, 'username');
	t.is(client.credentials.password, 'password');
});

test('Set address', t => {
	t.is(client.ip, '192.168.0.1');
});

test('Build params', t => {
	const actualOptions = client.buildOptions('IP', 'endpoint', {test: 'Steven'});
	const expectedOptions = {
		auth: {
			username: 'username',
			password: 'password'
		},
		qs: {
			test: 'Steven'
		},
		method: 'IP',
		uri: 'http://192.168.0.1/endpoint',
		headers: {
			'Content-Type': 'text/xml'
		}
	};

	t.deepEqual(actualOptions, expectedOptions);
});

test('Get /command', t => {
	BASE_NOCK
		.get('/command.xml')
		.reply(200, `<command></command>`);

	client
		.getCommands()
		.then(resp => t.is(resp, '<command></command>'));
});

test('Get /configuration', t => {
	BASE_NOCK
		.get('/configuration.xml')
		.reply(200, `<configuration></configuration>`);

	client
		.getConfiguration()
		.then(resp => t.is(resp, '<configuration></configuration>'));
});

test('Get /valuespace', t => {
	BASE_NOCK
		.get('/valuespace.xml')
		.reply(200, `<Valuespace></Valuespace>`);

	client
		.getValuespace()
		.then(resp => t.is(resp, '<Valuespace></Valuespace>'));
});

test('Get /status', t => {
	BASE_NOCK
		.get('/status.xml')
		.reply(200, `<Status></Status>`);

	client
		.getStatus()
		.then(resp => t.is(resp, '<Status></Status>'));
});

test('Post /putxml', t => {
	const response = '<?xml version="1.0"?><Configuration><Success/></Configuration>';
	BASE_NOCK
		.post('/putxml')
		.reply(200, response);

	client
		.putXml()
		.then(xmlResponse => t.is(xmlResponse, response));
});

test('Get /getxml', t => {
	const response = '<Status><Audio></Audio></Status>';
	BASE_NOCK
		.get('/getxml')
		.query({
			location: '/Status/Audio'
		})
		.reply(200, response);

	client
		.getXml('/Status/Audio')
		.then(xmlResponse => t.is(xmlResponse, response));
});
