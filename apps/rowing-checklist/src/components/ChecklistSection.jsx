import ChecklistItem from './ChecklistItem'
import { useTheme } from './ThemeProvider'

export default function ChecklistSection({ phase, checked, onToggle }) {
  const { dark } = useTheme()

  return (
    <section className="mb-6">
      <div className="flex items-baseline gap-2 mb-2 px-1">
        <h2
          className={`text-sm font-semibold tracking-wide uppercase ${
            dark ? 'text-warm-gray-400' : 'text-warm-gray-500'
          }`}
        >
          {phase.name}
        </h2>
        {phase.optional && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              dark ? 'bg-warm-gray-800 text-warm-gray-500' : 'bg-warm-gray-100 text-warm-gray-400'
            }`}
          >
            Optional
          </span>
        )}
        {phase.time && (
          <span
            className={`text-xs ${dark ? 'text-warm-gray-600' : 'text-warm-gray-300'}`}
          >
            {phase.time}
          </span>
        )}
      </div>
      {phase.description && (
        <p
          className={`text-xs px-1 mb-2 ${
            dark ? 'text-warm-gray-500' : 'text-warm-gray-400'
          }`}
        >
          {phase.description}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {phase.items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  )
}
