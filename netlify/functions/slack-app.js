import 'dotenv/config';
import pkg from '@slack/bolt'; const { App, AwsLambdaReceiver } = pkg;

const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

export const boltApp = {
    awsLambdaReceiver,
    app: new App({
        token: process.env.SLACK_BOT_TOKEN,
        receiver: awsLambdaReceiver
    })
};

export function initApp(boltApp) {
    boltApp.app.event('team_join', async ({ event, client }) => {
        try {
            await client.chat.postMessage({
                channel: event.user.id,
                text: 'Welcome! Please make sure to set your "Is/Was Trainee" profile field.',
            });
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    });

    boltApp.app.message(async ({ message, client }) => {
        // Check if the message is from a user in a channel (not a bot message)
        if (message.subtype !== 'bot_message' && message.user) {
            try {
                // Retrieve user profile information
                const userProfile = await client.users.profile.get({
                    user: message.user,
                });

                // Check if the 'Is/Was Trainee' field is empty
                if (!userProfile.profile.fields['Xf067WCKHDB6']) {
                    // Send a message to the user about the missing profile field
                    await client.chat.postMessage({
                        channel: message.user,
                        text: 'Please make sure to set your "Is/Was Trainee" profile field.',
                    });
                }
            } catch (error) {
                console.error('Error checking user profile:', error);
            }
        }
    });
}

initApp(boltApp);

export const handler = async (event, context, callback) => {
    const handler = await boltApp.awsLambdaReceiver.start();
    return handler(event, context, callback);
}