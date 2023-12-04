import crypto from 'crypto';
import { server, sentRequest, handlers } from './server.js';
import pkg from '@slack/bolt'; const { App, AwsLambdaReceiver } = pkg;
import { boltApp, initApp, handler } from '../netlify/functions/slack-app.js';
import teamJoinRequest from '../requests/team_join.json' assert { type: 'json' };

boltApp.awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: 'my-secret',
});

boltApp.app = new App({
    token: 'SLACK_TOKEN',
    receiver: boltApp.awsLambdaReceiver
});

initApp(boltApp);

// async function sendRequest() {
//     server.use(...handlers.teamJoin);

//     const result = await handler(createSlackRequest(teamJoinRequest));
//     console.log(result);
//     console.log(sentRequest.payload);
// }

// sendRequest();


describe('slack app', () => {
    it('returns 200 after receiving message event', async () => {
        server.use(...handlers.teamJoin);

        const result = await handler(createSlackRequest(teamJoinRequest));
        expect(rest.statusCode).toBe(200);
        expect(sentRequest.payload.text).toBe('Welcome! Please make sure to set your "Is Trainee" profile field.');
    });
});

function createSlackRequest(data, path = '/slack/events') {
    const body = JSON.stringify(data);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
        .createHmac('sha256', 'my-secret')
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