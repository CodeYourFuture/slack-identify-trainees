import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw';

export const server = setupServer(
    http.post('https://slack.com/api/auth.test', ({ request, params, cookies }) => {
        return HttpResponse.json({ ok: 'true' });
    }),
    http.post('https://slack.com/api/chat.postMessage', ({ request, params, cookies }) => {
        console.log(request);
        return HttpResponse.json({ ok: true });
    })
)

server.listen();