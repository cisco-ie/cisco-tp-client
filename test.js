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
	const actualOptions = client.buildOptions('IP', 'endpoint');
	const expectedOptions = {
		auth: {
			username: 'username',
			password: 'password'
		},
		method: 'IP',
		uri: 'http://192.168.0.1/endpoint',
		headers: {
			'Content-Type': 'application/xml'
		}
	};

	t.deepEqual(actualOptions, expectedOptions);
});

test('Get command', t => {
	BASE_NOCK
		.get('/command.xml')
		.reply(200, `<command></command>`);

	client
		.getCommands()
		.then(resp => t.is(resp, '<command></command>'));
});

test('Get configuration', t => {
	BASE_NOCK
		.get('/configuration.xml')
		.reply(200, `<configuration></configuration>`);

	client
		.getConfiguration()
		.then(resp => t.is(resp, '<configuration></configuration>'));
});
