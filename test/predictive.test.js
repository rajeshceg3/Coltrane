const { describe, it, before } = require('node:test')
const assert = require('assert')
const tactical = require('../src/tactical')

describe('Predictive Telemetry', () => {
  before(() => {
    // Reset state
    tactical.assets = []
  })

  it('should correctly predict movement for a single asset moving North', () => {
    // North (Heading 0), Speed 1, 10 minutes
    // Start at 50, 50
    // dy = -speed * cos(0) * min = -1 * 1 * 10 = -10
    // End should be 50, 40
    tactical.assets = [{ x: 50, y: 50, heading: 0, speed: 1, name: 'T1' }]
    const prediction = tactical.predictiveTelemetry(10)
    assert.strictEqual(prediction.centroid.x, 50)
    assert.ok(Math.abs(prediction.centroid.y - 40) < 0.1)
  })

  it('should correctly predict movement for a single asset moving East', () => {
    // East (Heading 90), Speed 1, 10 minutes
    // Start at 50, 50
    // dx = speed * sin(90) * min = 1 * 1 * 10 = 10
    // End should be 60, 50
    tactical.assets = [{ x: 50, y: 50, heading: 90, speed: 1, name: 'T2' }]
    const prediction = tactical.predictiveTelemetry(10)
    assert.ok(Math.abs(prediction.centroid.x - 60) < 0.1)
    assert.strictEqual(prediction.centroid.y, 50)
  })

  it('should clamp values to 0-100', () => {
    tactical.assets = [{ x: 95, y: 50, heading: 90, speed: 1, name: 'T3' }]
    // 10 mins -> x should be 105, but clamped to 100
    const prediction = tactical.predictiveTelemetry(10)
    assert.strictEqual(prediction.centroid.x, 100)
  })

  it('should predict dispersion change', () => {
    // Two assets moving apart
    // A1: 50,50 Heading 270 (West), Speed 1
    // A2: 50,50 Heading 90 (East), Speed 1
    // In 10 mins: A1 -> 40,50. A2 -> 60,50. Distance 20. Avg Separation 10?
    // Centroid 50,50.
    // Dist A1-C = 10. Dist A2-C = 10. Avg = 10.

    tactical.assets = [
      { x: 50, y: 50, heading: 270, speed: 1, name: 'A1' },
      { x: 50, y: 50, heading: 90, speed: 1, name: 'A2' }
    ]

    const current = tactical.telemetry
    assert.strictEqual(current.avgSeparation, 0)

    const prediction = tactical.predictiveTelemetry(10)
    assert.ok(Math.abs(prediction.avgSeparation - 10) < 1)
  })
})
