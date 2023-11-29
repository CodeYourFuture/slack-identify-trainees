require('dotenv').config();
const { App, AwsLambdaReceiver } = require('@slack/bolt');

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver
});

app.event('team_join', async ({ event, client }) => {
    try {
        await client.chat.postMessage({
            channel: event.user.id,
            text: 'Welcome! Please make sure to set your "Is Trainee" profile field.',
        });
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
});


app.message(async ({ message, client }) => {
    // Check if the message is from a user in a channel (not a bot message)
    if (message.subtype !== 'bot_message' && message.user) {
        try {
            // Retrieve user profile information
            const userProfile = await client.users.profile.get({
                user: message.user,
            });

            // Check if the 'Is Trainee' field is empty
            if (!userProfile.profile.fields['Xf067WCKHDB6']) {
                // Send a message to the user about the missing profile field
                await client.chat.postMessage({
                    channel: message.user,
                    text: 'Please make sure to set your "Is Trainee" profile field.',
                });
            }
        } catch (error) {
            console.error('Error checking user profile:', error);
        }
    }
});


module.exports.handler = async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start();
    return handler(event, context, callback);
}