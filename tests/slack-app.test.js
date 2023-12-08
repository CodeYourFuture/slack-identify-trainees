import crypto from 'crypto';
import { server, sentRequest, handlers } from './server.js';
import { boltApp, initApp, handler } from '../netlify/functions/slack-app.js';
import pkg from '@slack/bolt'; const { App, AwsLambdaReceiver } = pkg;
import teamJoinRequest from '../sample-data/team_join.json' assert { type: 'json' };
import messageRequest from '../sample-data/message.json' assert { type: 'json' };

boltApp.awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: 'slackSecret',
});

boltApp.app = new App({
    token: 'slackToken',
    receiver: boltApp.awsLambdaReceiver
});

initApp(boltApp);

beforeEach(() => {
    server.resetHandlers();
    delete sentRequest.payload;
});

afterAll(() => {
    server.close();
});

describe('slack app', () => {
    it('sends a message when a user joins the workspace', async () => {
        const result = await handler(createSlackRequest(teamJoinRequest));
        expect(result.statusCode).toBe(200);
        expect(sentRequest.payload.text).toBe('Welcome! Please make sure to set your "Am/Was a CYF Trainee" profile field.');
    });

    it('sends a message when a user posts a message in a channel and they have not set field', async () => {
        server.use(...handlers.messageFieldUnset);

        const result = await handler(createSlackRequest(messageRequest));
        expect(result.statusCode).toBe(200);
        expect(sentRequest.payload.text).toBe('Please make sure to set your "Am/Was a CYF Trainee" profile field.');
    });

    it('does not send a message when a user posts a message and field is set', async () => {
        server.use(...handlers.messageFieldSet);

        const result = await handler(createSlackRequest(messageRequest));
        expect(result.statusCode).toBe(200);
        expect(sentRequest).not.toHaveProperty('payload');
    });
});

function createSlackRequest(data, path = '/slack/events') {
    const body = JSON.stringify(data);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
        .createHmac('sha256', 'slackSecret')
        .update(`v0:${timestamp}:${body}`)
        .digest('hex');

    return {
        body,
        path,
        headers: {
            'content-type': 'application/json',
            'x-slack-request-timestamp': timestamp.toString(),
            'x-slack-signature': `v0=${signature}`,
        },
        httpMethod: 'POST',
    };
};