import 'dotenv/config';
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw';

export const sentRequest = {};

export const handlers = {
    teamJoin: [
        http.post('https://slack.com/api/auth.test', ({ request }) => {
            return HttpResponse.json({ ok: 'true' });
        }),
        http.post('https://slack.com/api/chat.postMessage', async ({ request }) => {
            sentRequest.payload = await getPayload(request);
            return HttpResponse.json({ ok: 'true' });
        })
    ],
    messageFieldUnset: [
        http.post('https://slack.com/api/users.profile.get', ({ request }) => {
            return HttpResponse.json({
                ok: true,
                profile: {
                    display_name: 'Gary',
                    fields: {}
                }
            });
        })
    ],
    messageFieldSet: [
        http.post('https://slack.com/api/users.profile.get', ({ request }) => {
            return HttpResponse.json({
                ok: true,
                profile: {
                    display_name: 'Gary',
                    fields: {
                        [process.env.CUSTOM_TRAINEE_FIELD]: 'Yes'
                    }
                }
            });
        })
    ]
};

export const server = setupServer(...handlers.teamJoin);

server.listen();

async function getPayload(request) {
    const entries = new URLSearchParams(await request.text()).entries();
    const payload = Object.fromEntries(entries);
    return payload;
}