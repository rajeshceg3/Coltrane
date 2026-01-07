const express = require('express')
const helmet = require('helmet')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-inline'"],
      'script-src-attr': ["'self'", "'unsafe-inline'"]
    }
  }
}))

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')))

app.use(express.json())

const tacticalSys = require('./tactical')

// Tactical API
app.get('/api/tactical', (req, res) => {
  res.json({ ...tacticalSys.getSystemStatus(), uptime: process.uptime() })
})

app.post('/api/tactical', (req, res) => {
  if (req.headers['x-auth-token'] !== 'SENTINEL-ALPHA') return res.status(401).json({ error: 'Unauthorized' })

  if (req.body && typeof req.body === 'object') {
    tacticalSys.updateStatus(req.body)
  }
  res.json(tacticalSys.getSystemStatus())
})

app.post('/api/assets', (req, res) => {
  if (req.headers['x-auth-token'] !== 'SENTINEL-ALPHA') return res.status(401).send()
  tacticalSys.addAsset(req.body)
  res.json({ success: true })
})

// Health Check API (Legacy)
app.get('/api/health', (req, res) => {
  res.json({
    status: tacticalSys.state.status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Sentinel Core active on port ${PORT}`)
  })
}

module.exports = app
