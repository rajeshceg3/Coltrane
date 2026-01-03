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
      'script-src': ["'self'", "'unsafe-inline'"]
    }
  }
}))

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')))

app.use(express.json())

let tacticalState = {
  status: 'operational',
  threatLevel: 'LOW',
  directive: 'MONITORING ACTIVE'
}

// Tactical API
app.get('/api/tactical', (req, res) => {
  res.json({ ...tacticalState, uptime: process.uptime() })
})

app.post('/api/tactical', (req, res) => {
  const auth = req.headers['x-auth-token']
  if (auth !== 'SENTINEL-ALPHA') return res.status(401).json({ error: 'Unauthorized' })

  if (req.body && typeof req.body === 'object') {
    tacticalState = { ...tacticalState, ...req.body }
    // Link System Status to Threat Level
    if (tacticalState.threatLevel === 'CRITICAL') tacticalState.status = 'alert'
    else if (tacticalState.threatLevel === 'LOW') tacticalState.status = 'operational'
  }
  res.json(tacticalState)
})

// Health Check API (Legacy)
app.get('/api/health', (req, res) => {
  res.json({
    status: tacticalState.status,
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
