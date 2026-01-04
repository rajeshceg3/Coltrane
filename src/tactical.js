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
      type: String(asset.type || 'Unit').slice(0, 30)
    }

    this.assets.push(safeAsset)
    this.logEvent('ASSET', `Unit registered: ${safeAsset.name}`)
  }

  getSystemStatus () {
    return { ...this.state, assets: this.assets, logs: this.logs }
  }
}

module.exports = new TacticalSystem()
