import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import WeeklyScore from '../components/WeeklyScore'
import { supabase } from '../services/supabase'
import { startOfWeek, endOfWeek, format } from 'date-fns'

export default function Weekly() {
  const [umarCount, setUmarCount] = useState(0)
  const [abdullahCount, setAbdullahCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const now = new Date()
      const start = startOfWeek(now, { weekStartsOn: 1 })
      const end = endOfWeek(now, { weekStartsOn: 1 })

      const startStr = format(start, 'yyyy-MM-dd')
      const endStr = format(end, 'yyyy-MM-dd')

      const { data } = await supabase
        .from('attendance')
        .select('person')
        .gte('prayer_date', startStr)
        .lte('prayer_date', endStr)

      let umar = 0
      let abdullah = 0
      data?.forEach((row) => {
        if (row.person === 'umar') umar++
        if (row.person === 'abdullah') abdullah++
      })

      setUmarCount(umar)
      setAbdullahCount(abdullah)
      setLoading(false)
    }
    load()
  }, [])

  const weekLabel =
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'd MMM') +
    ' – ' +
    format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'd MMM')

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-muted text-sm">
          ← Home
        </Link>
        <h1 className="text-xl font-bold text-text">Weekly Challenge</h1>
        <div className="w-10"></div>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : (
        <WeeklyScore
          umarCount={umarCount}
          abdullahCount={abdullahCount}
          weekLabel={weekLabel}
        />
      )}
    </div>
  )
}