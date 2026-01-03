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

test('GET /api/tactical', async (t) => {
  const server = app.listen(0)
  const port = server.address().port
  const url = `http://localhost:${port}/api/tactical`

  const response = await fetch(url)
  const data = await response.json()

  assert.strictEqual(response.status, 200)
  assert.strictEqual(data.threatLevel, 'LOW')
  assert.ok(data.uptime >= 0)

  server.close()
})

test('POST /api/tactical - Success', async (t) => {
  const server = app.listen(0)
  const port = server.address().port
  const url = `http://localhost:${port}/api/tactical`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': 'SENTINEL-ALPHA'
    },
    body: JSON.stringify({ threatLevel: 'CRITICAL', directive: 'ENGAGE' })
  })
  const data = await response.json()

  assert.strictEqual(response.status, 200)
  assert.strictEqual(data.threatLevel, 'CRITICAL')
  assert.strictEqual(data.status, 'alert')
  assert.strictEqual(data.directive, 'ENGAGE')

  server.close()
})

test('POST /api/tactical - Unauthorized', async (t) => {
  const server = app.listen(0)
  const port = server.address().port
  const url = `http://localhost:${port}/api/tactical`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ threatLevel: 'LOW' })
  })

  assert.strictEqual(response.status, 401)
  server.close()
})
