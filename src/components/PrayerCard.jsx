export default function PrayerCard({ name, status, onMark, onView, photoUrl }) {
  const isCompleted = status === 'completed' || status === 'late'
  const isLate = status === 'late'

  let buttonLabel = 'Locked'
  let buttonClass = 'bg-gray-100 text-gray-500'

  if (status === 'open') {
    buttonLabel = 'Mark as Prayed'
    buttonClass = 'bg-emerald text-white'
  } else if (status === 'completed') {
    buttonLabel = 'Completed'
    buttonClass = 'bg-emerald/15 text-emerald border border-emerald/30'
  } else if (status === 'late') {
    buttonLabel = 'Completed (Late)'
    buttonClass = 'bg-amber-50 text-amber-800 border border-amber-300'
  } else if (status === 'missed') {
    // This means window expired but not yet marked
    buttonLabel = 'Mark Late Attendance'
    buttonClass = 'bg-amber-100 text-amber-800 border border-amber-300'
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-emerald/5">
      <div>
        <h3 className="font-semibold text-emerald text-lg">{name}</h3>
        <p className="text-xs text-emerald/60 capitalize">
          {isCompleted ? (isLate ? 'Late entry' : 'On time') : status}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isCompleted && photoUrl && (
          <button
            onClick={onView}
            className="px-3 py-1.5 text-xs rounded-lg border border-emerald/30 text-emerald"
          >
            View
          </button>
        )}

        <button
          onClick={onMark}
          disabled={isCompleted || status === 'upcoming'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${buttonClass} disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}