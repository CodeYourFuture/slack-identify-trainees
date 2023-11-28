require('dotenv').config();
const { App, AwsLambdaReceiver } = require('@slack/bolt');

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver,
});

app.message(async ({ message, client }) => {
    try {
        // Open a direct message channel with the user
        const result = await client.conversations.open({
            users: message.user,
        });

        // Send a hello message
        await client.chat.postMessage({
            channel: result.channel.id,
            text: 'Hello!',
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}