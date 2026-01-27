import { useTheme } from './ThemeProvider'

export default function StatsCard({ label, value, detail, icon }) {
  const { dark } = useTheme()

  return (
    <div
      className={`p-4 rounded-xl border-2 ${
        dark
          ? 'bg-warm-gray-800 border-warm-gray-700'
          : 'bg-white border-warm-gray-200'
      }`}
    >
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <div
        className={`text-2xl font-bold mb-1 ${
          dark ? 'text-warm-gray-100' : 'text-warm-gray-900'
        }`}
      >
        {value}
      </div>
      <div
        className={`text-sm font-medium ${
          dark ? 'text-warm-gray-400' : 'text-warm-gray-600'
        }`}
      >
        {label}
      </div>
      {detail && (
        <div
          className={`text-xs mt-1 ${
            dark ? 'text-warm-gray-500' : 'text-warm-gray-500'
          }`}
        >
          {detail}
        </div>
      )}
    </div>
  )
}
