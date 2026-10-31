import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/t', () => HttpResponse.json({ ok: true })),
)
server.listen({ onUnhandledRequest: 'warn' })

for (const url of ['http://localhost/api/t', 'http://localhost:3000/api/t', 'http://127.0.0.1/api/t']) {
  try {
    const r = await fetch(url)
    const text = await r.text()
    console.log(url, '->', r.status, JSON.stringify(text))
  } catch (e) {
    console.log(url, '->', 'ERR', e.message)
  }
}
server.close()