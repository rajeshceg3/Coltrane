class TacticalSystem {
  constructor () {
    this.state = {
      status: 'operational',
      threatLevel: 'LOW',
      directive: 'MONITORING ACTIVE'
    }
    this.assets = []
    this.logs = []
    this.logEvent('SYSTEM', 'Initialization complete')
  }

  logEvent (source, action) {
    const timestamp = new Date().toISOString()
    this.logs.unshift({ timestamp, source, action })
    if (this.logs.length > 50) this.logs.pop()
  }

  updateStatus (updates) {
    if (!updates || typeof updates !== 'object') return
    const { auth, token, ...safeUpdates } = updates

    // Validate values are strings or numbers, no objects/arrays
    for (const key in safeUpdates) {
      if (typeof safeUpdates[key] === 'object') delete safeUpdates[key]
    }

    this.state = { ...this.state, ...safeUpdates }
    if (this.state.threatLevel === 'CRITICAL') this.state.status = 'alert'
    else if (this.state.threatLevel === 'LOW') this.state.status = 'operational'

    // Safe logging
    const threat = String(this.state.threatLevel || 'UNKNOWN')
    this.logEvent('COMMAND', `Status updated: ${threat}`)
  }

  addAsset (asset) {
    if (!asset || typeof asset !== 'object') return
    if (typeof asset.name !== 'string' || !asset.name.trim()) return

    const safeAsset = {
      name: String(asset.name).slice(0, 50), // Limit length
      type: String(asset.type || 'Unit').slice(0, 30),
      x: typeof asset.x === 'number' && asset.x >= 0 && asset.x <= 100 ? asset.x : Math.floor(Math.random() * 100),
      y: typeof asset.y === 'number' && asset.y >= 0 && asset.y <= 100 ? asset.y : Math.floor(Math.random() * 100)
    }

    this.assets.push(safeAsset)
    this.logEvent('ASSET', `Unit registered: ${safeAsset.name}`)
  }

  get telemetry () {
    if (!this.assets.length) return null
    const xs = this.assets.map(a => a.x)
    const ys = this.assets.map(a => a.y)
    const cx = Math.round(xs.reduce((a, b) => a + b, 0) / this.assets.length)
    const cy = Math.round(ys.reduce((a, b) => a + b, 0) / this.assets.length)

    // Avg distance from centroid
    const avgDist = Math.round(this.assets.reduce((sum, a) => {
      return sum + Math.sqrt(Math.pow(a.x - cx, 2) + Math.pow(a.y - cy, 2))
    }, 0) / this.assets.length)

    return {
      centroid: { x: cx, y: cy },
      avgSeparation: avgDist,
      posture: avgDist < 20 ? 'CONCENTRATED' : (avgDist > 40 ? 'DISPERSED' : 'OPTIMAL')
    }
  }

  getSystemStatus () {
    return { ...this.state, assets: this.assets, logs: this.logs, telemetry: this.telemetry }
  }
}

module.exports = new TacticalSystem()
