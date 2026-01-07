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
      y: typeof asset.y === 'number' && asset.y >= 0 && asset.y <= 100 ? asset.y : Math.floor(Math.random() * 100),
      heading: typeof asset.heading === 'number' && asset.heading >= 0 && asset.heading <= 360 ? asset.heading : 0,
      speed: typeof asset.speed === 'number' && asset.speed >= 0 && asset.speed <= 10 ? asset.speed : 0
    }

    this.assets.push(safeAsset)
    this.logEvent('ASSET', `Unit registered: ${safeAsset.name}`)
  }

  _calculateTelemetry (assets) {
    if (!assets.length) return null
    const xs = assets.map(a => a.x)
    const ys = assets.map(a => a.y)
    const cx = Math.round(xs.reduce((a, b) => a + b, 0) / assets.length)
    const cy = Math.round(ys.reduce((a, b) => a + b, 0) / assets.length)

    // Avg distance from centroid
    const avgDist = Math.round(assets.reduce((sum, a) => {
      return sum + Math.sqrt(Math.pow(a.x - cx, 2) + Math.pow(a.y - cy, 2))
    }, 0) / assets.length)

    return {
      centroid: { x: cx, y: cy },
      avgSeparation: avgDist,
      posture: avgDist < 20 ? 'CONCENTRATED' : (avgDist > 40 ? 'DISPERSED' : 'OPTIMAL')
    }
  }

  get telemetry () {
    return this._calculateTelemetry(this.assets)
  }

  predictiveTelemetry (minutes) {
    if (!this.assets.length) return null
    const predictedAssets = this.assets.map(a => {
      const theta = (a.heading || 0) * (Math.PI / 180)
      let px = a.x + ((a.speed || 0) * Math.sin(theta) * minutes)
      let py = a.y - ((a.speed || 0) * Math.cos(theta) * minutes)
      px = Math.max(0, Math.min(100, px))
      py = Math.max(0, Math.min(100, py))
      return { x: px, y: py }
    })
    return this._calculateTelemetry(predictedAssets)
  }

  getSystemStatus () {
    return {
      ...this.state,
      assets: this.assets,
      logs: this.logs,
      telemetry: this.telemetry,
      prediction: this.predictiveTelemetry(5)
    }
  }
}

module.exports = new TacticalSystem()
