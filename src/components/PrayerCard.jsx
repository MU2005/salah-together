export default function PrayerCard({ name, status, onMark, onView, photoUrl }) {
  const isCompleted = status === 'completed' || status === 'late'
  const isLate = status === 'late'

  let buttonLabel = 'Locked'
  let buttonClass = 'bg-white/5 text-muted'

  if (status === 'open') {
    buttonLabel = 'Mark as Prayed'
    buttonClass = 'bg-gradient-to-r from-purple to-purple-dark text-white'
  } else if (status === 'completed') {
    buttonLabel = 'Completed'
    buttonClass = 'bg-purple/20 text-purple-light border border-purple/30'
  } else if (status === 'late') {
    buttonLabel = 'Completed (Late)'
    buttonClass = 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
  } else if (status === 'missed') {
    buttonLabel = 'Mark Late Attendance'
    buttonClass = 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
  }

  return (
    <div className="card rounded-xl p-4 flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-text text-lg">{name}</h3>
        <p className="text-xs text-muted capitalize">
          {isCompleted ? (isLate ? 'Late entry' : 'On time') : status}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isCompleted && photoUrl && (
          <button
            onClick={onView}
            className="px-3 py-1.5 text-xs rounded-lg border border-purple/30 text-purple-light"
          >
            View
          </button>
        )}

        <button
          onClick={onMark}
          disabled={isCompleted || status === 'upcoming'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${buttonClass} disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}