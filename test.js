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
	const actualOptions = client.buildOptions('endpoint', {
		method: 'POST',
		qs: {
			test: 'Steven'
		},
		headers: {
			'Content-Type': 'application/xml'
		}
	});
	const expectedOptions = {
		auth: {
			username: 'username',
			password: 'password'
		},
		qs: {
			test: 'Steven'
		},
		method: 'POST',
		uri: 'http://192.168.0.1/endpoint',
		headers: {
			'Content-Type': 'application/xml'
		}
	};

	t.deepEqual(actualOptions, expectedOptions);
});

test('Get /command', async t => {
	t.plan(1);

	BASE_NOCK
		.get('/command.xml')
		.reply(200, `<command></command>`);

	const xmlResponse = await client.getCommands();

	t.is(xmlResponse, '<command></command>');
});

test('Get /configuration', async t => {
	t.plan(1);

	BASE_NOCK
		.get('/configuration.xml')
		.reply(200, `<configuration></configuration>`);

	const xmlResponse = await client.getConfiguration();

	t.is(xmlResponse, '<configuration></configuration>');
});

test('Get /valuespace', async t => {
	t.plan(1);

	BASE_NOCK
		.get('/valuespace.xml')
		.reply(200, `<Valuespace></Valuespace>`);

	const xmlResponse = await client.getValuespace();

	t.is(xmlResponse, '<Valuespace></Valuespace>');
});

test('Get /status', async t => {
	t.plan(1);

	BASE_NOCK
		.get('/status.xml')
		.reply(200, `<Status></Status>`);

	const xmlResponse = await client.getStatus();

	t.is(xmlResponse, '<Status></Status>');
});

test('Post /putxml', async t => {
	t.plan(1);

	const response = '<?xml version="1.0"?><Configuration><Success/></Configuration>';
	BASE_NOCK
		.post('/putxml')
		.reply(200, response);

	const xmlResponse = await client.putXml('testing');

	t.is(xmlResponse, response);
});

test('Post /formputxml', async t => {
	t.plan(1);

	const response = '<?xml version="1.0"?><Configuration><Success/></Configuration>';

	nock(`http://${IP}`, {
		reqheaders: {
			'content-type': 'application/x-www-form-urlencoded'
		}})
		.post('/formputxml')
		.query({
			xmldoc: '<Test></Test>'
		})
		.reply(200, response);

	const xmlResponse = await client.putXmlWithForm('<Test></Test>');

	t.is(xmlResponse, response);
});

test('Get /getxml', async t => {
	t.plan(1);

	const response = '<Status><Audio></Audio></Status>';
	BASE_NOCK
		.get('/getxml')
		.query({
			location: '/Status/Audio'
		})
		.reply(200, response);

	const xmlResponse = await client.getXml('/Status/Audio');

	t.is(xmlResponse, response);
});

test('Set httpFeedback', async t => {
	t.plan(1);

	const feedbackXML = `
<Command>
<HttpFeedback>
<Register command="True">
<FeedbackSlot>1</FeedbackSlot>
<ServerUrl>http://serverurl.com/test</ServerUrl>
<Expression item="1">/Event/CallDisconnect</Expression>
</Register>
</HttpFeedback>
</Command>`;

	BASE_NOCK
		.post('/putxml', feedbackXML)
		.reply(200, '<Success></Success>');

	const feedbackResp = await client.setHttpFeedback({
		feedbackSlot: 1,
		serverUrl: 'http://serverurl.com/test',
		expressions: [
			'/Event/CallDisconnect'
		]
	});

	t.is(feedbackResp, '<Success></Success>');
});

test('Throw error for no payloads', t => {
	const putXmlError = t.throws(() => {
		client.putXml();
	}, Error);

	t.is(putXmlError.message, 'Payload parameter not defined');

	const formPutXmlError = t.throws(() => {
		client.putXmlWithForm();
	}, Error);

	t.is(formPutXmlError.message, 'Payload parameter not defined');
});

test('Throws error for setHttpFeedback', t => {
	const error = t.throws(() => {
		client.setHttpFeedback({
			feedbackSlot: 1,
			expressions: [
				'/Event/CallDisconnect'
			]
		});
	}, Error);

	t.is(error.message, 'One or more required parameters are not defined');

	const error2 = t.throws(() => {
		client.setHttpFeedback({
			feedbackSlot: 2,
			serverUrl: 'http://test/',
			expressions: [
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
			]
		});
	}, Error);

	t.is(error2.message, 'Length of expressions cannot be greater than 15');

	const error3 = t.throws(() => {
		client.setHttpFeedback({
			feedbackSlot: 2,
			serverUrl: 'http://test/'
		});
	}, Error);

	t.is(error3.message, 'No feedback expressions are defined');
});

