import { useState } from 'react'
import Navigation from './components/Navigation'
import ZoneCalculator from './tools/ZoneCalculator'
import WattsPaceConverter from './tools/WattsPaceConverter'

function App() {
  const [activeTool, setActiveTool] = useState('zones')

  const tools = [
    { id: 'zones', label: 'HR Zones' },
    { id: 'converter', label: 'Watts/Pace' }
  ]

  return (
    <div className="app-container">
      <h1>Rowing Tools</h1>
      <Navigation
        tools={tools}
        activeTool={activeTool}
        onToolChange={setActiveTool}
      />

      {activeTool === 'zones' && <ZoneCalculator />}
      {activeTool === 'converter' && <WattsPaceConverter />}
    </div>
  )
}

export default App
