const crypto = require('crypto');
const { handler } = require('./netlify/functions/slack-app');

const createSlackRequest = (data, path = '/slack/events') => {
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

async function sendRequest() {
    const result = await handler(createSlackRequest({
        "token": "ss",
        "team_id": "T067R0W54MT",
        "context_team_id": "T067R0W54MT",
        "context_enterprise_id": null,
        "api_app_id": "A067TUZBRNW",
        "event": {
            "client_msg_id": "3dae357c-10f2-4282-9bad-b7db5b49d206",
            "type": "message",
            "text": "dd",
            "user": "U067DCKFN79",
            "ts": "1701392921.007729",
            "blocks": [
                {
                    "type": "rich_text",
                    "block_id": "Pbq1n",
                    "elements": [
                        {
                            "type": "rich_text_section",
                            "elements": [
                                {
                                    "type": "text",
                                    "text": "dd"
                                }
                            ]
                        }
                    ]
                }
            ],
            "team": "T067R0W54MT",
            "channel": "C067TU8NK5G",
            "event_ts": "1701392921.007729",
            "channel_type": "channel"
        },
        "type": "event_callback",
        "event_id": "Ev0687BG232Q",
        "event_time": 1701392921,
        "authorizations": [
            {
                "enterprise_id": null,
                "team_id": "T067R0W54MT",
                "user_id": "U068H7MGY5N",
                "is_bot": true,
                "is_enterprise_install": false
            }
        ],
        "is_ext_shared_channel": false,
        "event_context": "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUMDY3UjBXNTRNVCIsImFpZCI6IkEwNjdUVVpCUk5XIiwiY2lkIjoiQzA2N1RVOE5LNUcifQ"
    }));
    console.log(result);

}

sendRequest();


// describe('slack app', () => {
//     it('returns 200 after receiving message event', async () => {
//         const result = await handler(createSlackRequest({ 'type': 'message' }));
//         console.log(result);
//         // expect(result.statusCode).toBe(200);
//     });
// });