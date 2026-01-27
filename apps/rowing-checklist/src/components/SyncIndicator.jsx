import { useTheme } from './ThemeProvider'

export default function SyncIndicator({ syncing, syncError }) {
  const { dark } = useTheme()

  if (!syncing && !syncError) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 ${
          syncError
            ? dark
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-red-50 text-red-600 border border-red-200'
            : dark
            ? 'bg-warm-gray-800 text-warm-gray-300 border border-warm-gray-700'
            : 'bg-white text-warm-gray-600 border border-warm-gray-200'
        }`}
      >
        {syncing && (
          <>
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Syncing...</span>
          </>
        )}
        {syncError && (
          <>
            <span>⚠️</span>
            <span>{syncError}</span>
          </>
        )}
      </div>
    </div>
  )
}
