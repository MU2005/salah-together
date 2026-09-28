export default function WeeklyScore({ umarCount, abdullahCount, weekLabel }) {
  const totalPossible = 35
  const umarPct = Math.round((umarCount / totalPossible) * 100)
  const abdullahPct = Math.round((abdullahCount / totalPossible) * 100)

  let resultText = ''
  let resultColor = 'text-purple-light'

  if (umarCount > abdullahCount) {
    resultText = 'Umar is currently leading'
    resultColor = 'text-purple-light'
  } else if (abdullahCount > umarCount) {
    resultText = 'Abdullah is currently leading'
    resultColor = 'text-purple-light'
  } else {
    resultText = "It's currently a draw"
    resultColor = 'text-muted'
  }

  return (
    <div className="card rounded-2xl p-5">
      <h2 className="text-lg font-semibold text-text mb-1">This Week</h2>
      <p className="text-xs text-muted mb-5">{weekLabel} · 35 possible prayers</p>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-text">Umar</span>
            <span className="text-muted">{umarCount} / 35</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple to-purple-light rounded-full"
              style={{ width: umarPct + '%' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-text">Abdullah</span>
            <span className="text-muted">{abdullahCount} / 35</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple to-purple-light rounded-full"
              style={{ width: abdullahPct + '%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className={`text-center rounded-xl py-3 px-4 font-medium bg-white/5 ${resultColor}`}>
        {resultText}
      </div>
    </div>
  )
}