export default function WeeklyScore({ umarCount, abdullahCount, weekLabel }) {
  const totalPossible = 35
  const umarPct = Math.round((umarCount / totalPossible) * 100)
  const abdullahPct = Math.round((abdullahCount / totalPossible) * 100)

  let resultText = ''
  if (umarCount > abdullahCount) {
    resultText = 'Abdullah owes Umar a pizza!'
  } else if (abdullahCount > umarCount) {
    resultText = 'Umar owes Abdullah a pizza!'
  } else {
    resultText = "It's a draw — no pizza owed!"
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-emerald/10">
      <h2 className="text-lg font-semibold text-emerald mb-1">Weekly Challenge</h2>
      <p className="text-xs text-emerald/60 mb-4">{weekLabel} · 35 possible prayers</p>

      <div className="space-y-3 mb-5">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Umar</span>
            <span>{umarCount} / 35</span>
          </div>
          <div className="h-2 bg-emerald/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald rounded-full"
              style={{ width: umarPct + '%' }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Abdullah</span>
            <span>{abdullahCount} / 35</span>
          </div>
          <div className="h-2 bg-emerald/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald rounded-full"
              style={{ width: abdullahPct + '%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="text-center bg-gold/10 text-amber-800 rounded-xl py-3 px-4 font-medium">
        🍕 {resultText}
      </div>
    </div>
  )
}
