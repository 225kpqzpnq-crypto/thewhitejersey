function Navigation({ tools, activeTool, onToolChange }) {
  return (
    <nav className="nav-tabs">
      {tools.map(tool => (
        <button
          key={tool.id}
          className={`nav-tab ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => onToolChange(tool.id)}
        >
          {tool.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
