const { createHmac } = require('node:crypto');
const { handler } = require('./netlify/functions/slack-app');

async function sendRequest() {
    const secret = 'my-secret';
    const hmac = createHmac("sha256", secret);
    const signature = hmac.digest("hex");

    const body = JSON.stringify({
        type: 'message'
    });

    const headers = {
        'content-type': 'application/json',
        'x-slack-signature': `v0=${signature}`
    }

    const res = await handler({ body, headers });
    console.log(res);
}

sendRequest();