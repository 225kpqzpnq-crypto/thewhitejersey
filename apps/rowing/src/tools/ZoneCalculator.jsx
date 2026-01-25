import { useState, useEffect } from 'react'

const ZONES = [
  {
    id: 1,
    name: 'UT2',
    min: 0.60,
    max: 0.70,
    powerMin: 0.50,
    powerMax: 0.60,
    label: 'Aerobic Capacity',
    rate: '16-18',
    description: 'Light effort. Can hold a conversation. Long steady state, 60+ min pieces.'
  },
  {
    id: 2,
    name: 'UT1',
    min: 0.70,
    max: 0.80,
    powerMin: 0.60,
    powerMax: 0.70,
    label: 'Aerobic Endurance',
    rate: '18-22',
    description: 'Moderate effort. Comfortably hard. Steady state, 20-40 min intervals.'
  },
  {
    id: 3,
    name: 'AT',
    min: 0.80,
    max: 0.85,
    powerMin: 0.70,
    powerMax: 0.80,
    label: 'Threshold',
    rate: '24-28',
    description: 'Hard effort. Threshold work, 8-20 min intervals.'
  },
  {
    id: 4,
    name: 'TR',
    min: 0.85,
    max: 0.95,
    powerMin: 0.80,
    powerMax: 0.90,
    label: 'Transport/Race',
    rate: '26-32',
    description: 'Very hard effort. Race pace for longer pieces. 2-8 min intervals.'
  },
  {
    id: 5,
    name: 'AN',
    min: 0.95,
    max: 1.00,
    powerMin: 0.95,
    powerMax: 1.10,
    label: 'Anaerobic',
    rate: '32+',
    description: 'Maximum effort. Sprint work only. Short intervals with full recovery.'
  }
]

const STORAGE_KEY = 'rowing-hr-settings'

// Convert pace (seconds per 500m) to watts
function paceToWatts(paceSeconds) {
  if (paceSeconds <= 0) return 0
  return 2.8 * Math.pow(500 / paceSeconds, 3)
}

// Convert watts to pace (seconds per 500m)
function wattsToPace(watts) {
  if (watts <= 0) return 0
  return 500 / Math.pow(watts / 2.8, 1 / 3)
}

// Format seconds to mm:ss.s
function formatPace(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '--:--.-'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toFixed(1).padStart(4, '0')}`
}

// Parse pace string to seconds
function parsePace(paceStr) {
  if (!paceStr) return 0
  const parts = paceStr.split(':')
  if (parts.length !== 2) return 0
  const minutes = parseInt(parts[0], 10) || 0
  const seconds = parseFloat(parts[1]) || 0
  return minutes * 60 + seconds
}

function ZoneCalculator() {
  const [maxHR, setMaxHR] = useState(180)
  const [restingHR, setRestingHR] = useState(50)
  const [splitPace, setSplitPace] = useState('1:45.0')
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { maxHR: savedMax, restingHR: savedRest, splitPace: savedSplit } = JSON.parse(saved)
        if (savedMax) setMaxHR(savedMax)
        if (savedRest) setRestingHR(savedRest)
        if (savedSplit) setSplitPace(savedSplit)
      } catch (e) {
        console.error('Failed to load saved HR settings')
      }
    }
  }, [])

  // Save settings when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ maxHR, restingHR, splitPace }))
      setSavedIndicator(true)
      setTimeout(() => setSavedIndicator(false), 2000)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [maxHR, restingHR, splitPace])

  // Calculate 2k watts from split pace
  const splitSeconds = parsePace(splitPace)
  const twoKWatts = Math.round(paceToWatts(splitSeconds))

  // Calculate zone HR using Karvonen method
  const calculateZoneHR = (percentage) => {
    const hrReserve = maxHR - restingHR
    return Math.round(restingHR + hrReserve * percentage)
  }

  // Calculate zones with HR and watts
  const zones = ZONES.map(zone => {
    const minWatts = Math.round(twoKWatts * zone.powerMin)
    const maxWatts = Math.round(twoKWatts * zone.powerMax)
    return {
      ...zone,
      lowHR: calculateZoneHR(zone.min),
      highHR: calculateZoneHR(zone.max),
      minWatts,
      maxWatts,
      slowPace: wattsToPace(minWatts),
      fastPace: wattsToPace(maxWatts)
    }
  })

  // Graph height in pixels
  const GRAPH_HEIGHT = 200

  // Chart range: from Z1 low to Z5 high (maxHR)
  const chartMin = zones[0].lowHR  // Z1 low
  const chartMax = maxHR           // Z5 high
  const chartRange = chartMax - chartMin

  // Calculate bar height based on HR range (proportional to chart range)
  const getBarHeight = (zone) => {
    const zoneRange = zone.highHR - zone.lowHR
    return (zoneRange / chartRange) * GRAPH_HEIGHT
  }

  // Calculate spacer height (distance from chart bottom to zone start)
  const getSpacerHeight = (zone) => {
    const distanceFromBottom = zone.lowHR - chartMin
    return (distanceFromBottom / chartRange) * GRAPH_HEIGHT
  }

  return (
    <div>
      <div className="card">
        <h2>Your Settings</h2>
        {savedIndicator && <span className="save-indicator">Saved</span>}

        <div className="grid-2">
          <div>
            <div className="input-group">
              <label>Max Heart Rate (bpm)</label>
              <div className="slider-with-input">
                <input
                  type="range"
                  min="140"
                  max="220"
                  value={maxHR}
                  onChange={(e) => setMaxHR(Number(e.target.value))}
                />
                <input
                  type="number"
                  min="140"
                  max="220"
                  value={maxHR}
                  onChange={(e) => setMaxHR(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Resting Heart Rate (bpm)</label>
              <div className="slider-with-input">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={restingHR}
                  onChange={(e) => setRestingHR(Number(e.target.value))}
                />
                <input
                  type="number"
                  min="30"
                  max="100"
                  value={restingHR}
                  onChange={(e) => setRestingHR(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="input-group">
              <label>2k Split Pace</label>
              <input
                type="text"
                placeholder="m:ss.s"
                value={splitPace}
                onChange={(e) => setSplitPace(e.target.value)}
                style={{ fontSize: '1.2rem', fontWeight: 700 }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              marginTop: '10px',
              padding: '12px',
              background: '#f5f5f5',
              border: '2px solid #1a1a1a'
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>2k Watts</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6B00' }}>{twoKWatts}W</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>HRR</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{maxHR - restingHR}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Training Zones</h2>
        <p style={{ fontSize: '0.85rem', marginBottom: '15px', color: '#666' }}>
          HR zones (Karvonen) + Power zones (% of 2k watts)
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Type</th>
                <th>HR Range</th>
                <th>Pace</th>
                <th>Watts</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {zones.map(zone => (
                <tr
                  key={zone.id}
                  className={`zone-${zone.id}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                >
                  <td style={{ fontWeight: 700 }}>{zone.name}</td>
                  <td style={{ fontSize: '0.8rem' }}>{zone.label}</td>
                  <td>{zone.lowHR}-{zone.highHR}</td>
                  <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {formatPace(zone.slowPace)}-{formatPace(zone.fastPace)}
                  </td>
                  <td style={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
                    {zone.minWatts}-{zone.maxWatts}W
                  </td>
                  <td>{zone.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedZone && (
          <div className="zone-description">
            <strong>{zones[selectedZone - 1].name} - {zones[selectedZone - 1].label}</strong>
            <p style={{ marginTop: '8px' }}>{zones[selectedZone - 1].description}</p>
          </div>
        )}

        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '10px' }}>
          Click a zone row to see training guidance
        </p>
      </div>

      <div className="card">
        <h2>Zone Visualization</h2>
        <div className="zone-graph" style={{ height: `${GRAPH_HEIGHT + 30}px` }}>
          {zones.map(zone => (
            <div key={zone.id} className="zone-bar">
              <div className="zone-bar-wrapper">
                {/* Visible zone bar - positioned absolutely from bottom */}
                <div
                  className={`zone-bar-fill zone-${zone.id}`}
                  style={{
                    height: `${getBarHeight(zone)}px`,
                    bottom: `${getSpacerHeight(zone)}px`
                  }}
                >
                  <span className="zone-bar-range">{zone.lowHR}-{zone.highHR}</span>
                </div>
              </div>
              <span className="zone-bar-label">Z{zone.id}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
          <span>{chartMin} bpm</span>
          <span>{chartMax} bpm</span>
        </div>
      </div>
    </div>
  )
}

export default ZoneCalculator
