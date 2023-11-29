require('dotenv').config();
const { ServerlessTester, events } = require('@slack-wrench/fixtures');
const { App, ExpressReceiver } = require('@slack/bolt');

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

const receiver = new ExpressReceiver({ signingSecret });
const app = new App({ receiver, token });
const handler = new ServerlessTester(receiver.app, signingSecret);

describe('slack app', () => {
    it('returns 200 after receiving message event', async () => {
        const result = await handler.sendSlackEvent(events.message('Hello World'));
        expect(result.statusCode).toBe(200);
    });
});