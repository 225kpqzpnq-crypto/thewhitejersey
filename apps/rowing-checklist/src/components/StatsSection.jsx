import { useTheme } from './ThemeProvider'
import StatsCard from './StatsCard'
import { formatDistance, formatDuration } from '../utils/stats'

const periodLabels = {
  week: 'This Week',
  month: 'This Month',
  all: 'All Time',
}

export default function StatsSection({ period, stats, onPeriodChange }) {
  const { dark } = useTheme()
  const periods = ['week', 'month', 'all']

  return (
    <div className="mb-6">
      {/* Period Selector */}
      <div className="flex gap-2 mb-4">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border-0 ${
              period === p
                ? 'bg-amber-accent text-white'
                : dark
                ? 'bg-warm-gray-800 text-warm-gray-300 hover:bg-warm-gray-700'
                : 'bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200'
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatsCard
          label="Pre-Rowing"
          value={stats.preRowingSessions}
          icon="🏋️"
        />
        <StatsCard
          label="Post-Rowing"
          value={stats.postRowingSessions}
          icon="🧘"
        />
        <StatsCard
          label="Rowing Sessions"
          value={stats.rowingSessions}
          icon="🚣"
        />
        <StatsCard
          label="Total Distance"
          value={formatDistance(stats.totalDistance)}
        />
        <StatsCard
          label="Total Time"
          value={formatDuration(stats.totalTime)}
        />
      </div>
    </div>
  )
}
