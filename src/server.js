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
      "script-src": ["'self'", "'unsafe-inline'"]
    }
  }
}))

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')))

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
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
