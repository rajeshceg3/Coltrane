const test = require('node:test')
const assert = require('node:assert')
const app = require('../src/server')

test('GET /api/health', async (t) => {
  const server = app.listen(0)
  const port = server.address().port
  const url = `http://localhost:${port}/api/health`

  const response = await fetch(url)
  const data = await response.json()

  assert.strictEqual(response.status, 200)
  assert.strictEqual(data.status, 'operational')
  assert.ok(data.uptime >= 0)

  server.close()
})
