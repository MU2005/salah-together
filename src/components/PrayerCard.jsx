export default function PrayerCard({ name, status, onMark }) {
  const statusStyles = {
    upcoming: 'bg-gray-100 text-gray-500',
    open: 'bg-emerald text-white',
    completed: 'bg-emerald/20 text-emerald border border-emerald/30',
    late: 'bg-amber-100 text-amber-800 border border-amber-300',
    missed: 'bg-red-50 text-red-600'
  }

  const buttonText = {
    upcoming: 'Locked',
    open: 'Mark as Prayed',
    completed: 'Completed',
    late: 'Mark Late Attendance',
    missed: 'Missed'
  }

  const classes = 'px-4 py-2 rounded-lg text-sm font-medium transition ' + 
    (statusStyles[status] || statusStyles.upcoming) + 
    ' disabled:opacity-60 disabled:cursor-not-allowed'

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-emerald/5">
      <div>
        <h3 className="font-semibold text-emerald text-lg">{name}</h3>
        <p className="text-xs text-emerald/60 capitalize">{status}</p>
      </div>

      <button
        onClick={onMark}
        disabled={status === 'upcoming' || status === 'completed' || status === 'missed'}
        className={classes}
      >
        {buttonText[status] || 'Locked'}
      </button>
    </div>
  )
}