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
    ]
};

export const server = setupServer(...handlers.teamJoin);

server.listen();

beforeEach(() => {
    server.resetHandlers();
});

afterAll(() => {
    server.close();
});

async function getPayload(request) {
    const entries = new URLSearchParams(await request.text()).entries();
    const payload = Object.fromEntries(entries);
    return payload;
}