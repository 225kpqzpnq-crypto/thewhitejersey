import { useState, useEffect } from 'react'

// Standard rowing distances in meters
const DISTANCES = [
  { meters: 500, label: '500m' },
  { meters: 2000, label: '2k' },
  { meters: 5000, label: '5k' },
  { meters: 6000, label: '6k' },
  { meters: 10000, label: '10k' }
]

// Training zones based on percentage of 2k power (from Excel calculator)
const TRAINING_ZONES = [
  {
    id: 'ut2',
    name: 'UT2',
    label: 'Aerobic Capacity',
    minPct: 50,
    maxPct: 60,
    rate: '16-18 spm',
    example: '2-3 x 20-30min',
    description: 'Long steady state. Building aerobic base. 60+ min pieces.'
  },
  {
    id: 'ut1',
    name: 'UT1',
    label: 'Aerobic Endurance',
    minPct: 60,
    maxPct: 70,
    rate: '18-22 spm',
    example: '6 x 10min on / 2min off',
    description: 'Moderate steady state. 20-40 min intervals.'
  },
  {
    id: 'at',
    name: 'AT',
    label: 'Anaerobic Threshold',
    minPct: 70,
    maxPct: 80,
    rate: '24-28 spm',
    example: '8 x 1km, 4 x 2km',
    description: 'Threshold work. 8-20 min intervals.'
  },
  {
    id: 'tr',
    name: 'TR',
    label: 'Transport / Race',
    minPct: 80,
    maxPct: 90,
    rate: '26-32 spm',
    example: '4 x (1min on / off x 4)',
    description: 'Race pace efforts. 2-8 min intervals.'
  },
  {
    id: 'an',
    name: 'AN',
    label: 'Anaerobic',
    minPct: 95,
    maxPct: 110,
    rate: '32+ spm',
    example: '7 x (1min on / 7min off)',
    description: 'Max effort sprints. Short intervals with full recovery.'
  }
]

const STORAGE_KEY = 'rowing-pace-settings'

// Convert pace (seconds per 500m) to watts
// Formula: watts = 2.8 × (500 / split_seconds)³
function paceToWatts(paceSeconds) {
  if (paceSeconds <= 0) return 0
  return 2.8 * Math.pow(500 / paceSeconds, 3)
}

// Convert watts to pace (seconds per 500m)
// Inverse: split_seconds = 500 / (watts / 2.8)^(1/3)
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

// Format seconds to longer time format (h:mm:ss or mm:ss)
function formatTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '--:--'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.round(totalSeconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Parse pace string (mm:ss.s) to seconds
function parsePace(paceStr) {
  if (!paceStr) return 0
  const parts = paceStr.split(':')
  if (parts.length !== 2) return 0
  const minutes = parseInt(parts[0], 10) || 0
  const seconds = parseFloat(parts[1]) || 0
  return minutes * 60 + seconds
}

// Calculate pace at a given percentage of reference pace
// Lower percentage = slower pace (higher split time)
function paceAtPercentage(referencePaceSeconds, percentage) {
  // At 100% of effort, you maintain reference pace
  // At lower %, you go slower (higher split)
  // watts = base_watts * (percentage/100)
  const referenceWatts = paceToWatts(referencePaceSeconds)
  const targetWatts = referenceWatts * (percentage / 100)
  return wattsToPace(targetWatts)
}

function WattsPaceConverter() {
  const [inputMode, setInputMode] = useState('pace') // 'pace' or 'watts'
  const [paceInput, setPaceInput] = useState('2:00.0')
  const [wattsInput, setWattsInput] = useState('203')
  const [referencePace, setReferencePace] = useState('1:45.0')

  // Current values
  const [currentWatts, setCurrentWatts] = useState(203)
  const [currentPace, setCurrentPace] = useState(120) // seconds

  // Load saved reference pace
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { referencePace: savedRef } = JSON.parse(saved)
        if (savedRef) setReferencePace(savedRef)
      } catch (e) {
        console.error('Failed to load saved pace settings')
      }
    }
  }, [])

  // Save reference pace
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ referencePace }))
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [referencePace])

  // Update calculations when inputs change
  useEffect(() => {
    if (inputMode === 'pace') {
      const paceSeconds = parsePace(paceInput)
      setCurrentPace(paceSeconds)
      setCurrentWatts(Math.round(paceToWatts(paceSeconds)))
    } else {
      const watts = parseFloat(wattsInput) || 0
      setCurrentWatts(watts)
      setCurrentPace(wattsToPace(watts))
    }
  }, [inputMode, paceInput, wattsInput])

  // Calculate time for a distance at current pace
  const calculateTime = (distanceMeters) => {
    if (!currentPace || currentPace <= 0) return 0
    return (distanceMeters / 500) * currentPace
  }

  // Reference pace in seconds for training zones
  const refPaceSeconds = parsePace(referencePace)

  return (
    <div>
      {/* Converter Card */}
      <div className="card">
        <h2>Watts ⇄ Pace Converter</h2>

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${inputMode === 'pace' ? '' : 'btn-secondary'}`}
            onClick={() => setInputMode('pace')}
          >
            Enter Pace
          </button>
          <button
            className={`btn ${inputMode === 'watts' ? '' : 'btn-secondary'}`}
            onClick={() => setInputMode('watts')}
          >
            Enter Watts
          </button>
        </div>

        {inputMode === 'pace' ? (
          <div className="input-group">
            <label>Split Time (per 500m)</label>
            <input
              type="text"
              placeholder="m:ss.s"
              value={paceInput}
              onChange={(e) => setPaceInput(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
              Format: m:ss.s (e.g., 2:00.0 or 1:45.5)
            </p>
          </div>
        ) : (
          <div className="input-group">
            <label>Power (Watts)</label>
            <input
              type="number"
              min="50"
              max="600"
              value={wattsInput}
              onChange={(e) => setWattsInput(e.target.value)}
            />
          </div>
        )}

        <div className="grid-2" style={{ marginTop: '20px' }}>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f5f5f5', border: '2px solid #1a1a1a' }}>
            <div className="metric-label">Pace (500m)</div>
            <div className="metric-value">{formatPace(currentPace)}</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f5f5f5', border: '2px solid #1a1a1a' }}>
            <div className="metric-label">Power</div>
            <div className="metric-value">{currentWatts}W</div>
          </div>
        </div>
      </div>

      {/* Time Predictions Card */}
      <div className="card">
        <h2>Time Predictions</h2>
        <p style={{ fontSize: '0.85rem', marginBottom: '15px', color: '#666' }}>
          Projected times at current pace (assuming even split)
        </p>

        <div className="grid-3">
          {DISTANCES.map(dist => (
            <div key={dist.meters} className="prediction-card">
              <div className="distance">{dist.label}</div>
              <div className="time">{formatTime(calculateTime(dist.meters))}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Zones Card */}
      <div className="card">
        <h2>Training Zones</h2>
        <p style={{ fontSize: '0.85rem', marginBottom: '15px', color: '#666' }}>
          Based on your 2k reference pace (% of 2k power)
        </p>

        <div className="input-group">
          <label>Your 2k Split (Reference)</label>
          <input
            type="text"
            placeholder="m:ss.s"
            value={referencePace}
            onChange={(e) => setReferencePace(e.target.value)}
          />
        </div>

        {refPaceSeconds > 0 && (
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '10px',
            padding: '10px',
            background: '#f5f5f5',
            border: '2px solid #1a1a1a'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>2k Time: </span>
              <span style={{ fontWeight: 800 }}>{formatTime(refPaceSeconds * 4)}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>2k Watts: </span>
              <span style={{ fontWeight: 800, color: '#FF6B00' }}>{Math.round(paceToWatts(refPaceSeconds))}W</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          {/* Header Row */}
          <div className="training-zone-header">
            <div>Zone</div>
            <div style={{ textAlign: 'right' }}>Pace</div>
            <div style={{ textAlign: 'right' }}>Watts</div>
            <div style={{ textAlign: 'right' }}>Rate</div>
          </div>

          {TRAINING_ZONES.map(zone => {
            const refWatts = paceToWatts(refPaceSeconds)
            const minWatts = Math.round(refWatts * (zone.minPct / 100))
            const maxWatts = Math.round(refWatts * (zone.maxPct / 100))
            const slowPace = paceAtPercentage(refPaceSeconds, zone.minPct)
            const fastPace = paceAtPercentage(refPaceSeconds, zone.maxPct)

            return (
              <div key={zone.id} className="training-zone-row training-zone-grid">
                <div>
                  <div className="training-zone-name">{zone.name} - {zone.label}</div>
                  <div className="training-zone-description">{zone.description}</div>
                  <div style={{ fontSize: '0.7rem', color: '#00994d', marginTop: '2px' }}>
                    {zone.example}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.85rem' }}>
                  {formatPace(slowPace)}<br/>
                  <span style={{ color: '#666' }}>to</span> {formatPace(fastPace)}
                </div>
                <div style={{ textAlign: 'right', fontWeight: 800, color: '#FF6B00', fontSize: '0.9rem' }}>
                  {minWatts}-{maxWatts}W
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666' }}>
                  {zone.rate}
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '15px' }}>
          Zones calculated as percentage of 2k power. Lower zone % = slower pace (higher split).
        </p>
      </div>
    </div>
  )
}

export default WattsPaceConverter
