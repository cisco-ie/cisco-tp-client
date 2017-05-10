import test from 'ava';
import CiscoTPClient from '.';

test('Set credentials', t => {
	const client = new CiscoTPClient({
		username: 'username',
		password: 'password'
	});

	console.log(client);
	t.is(client.credentials.username, 'username');
	t.is(client.credentials.password, 'password');
});

