import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { format } from 'date-fns'

export default function History() {
  const { person } = useParams()
  const displayName = person === 'umar' ? 'Umar' : 'Abdullah'

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewPhoto, setViewPhoto] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('person', person)
        .order('prayer_date', { ascending: false })
        .order('marked_at', { ascending: false })

      if (!error) {
        setRecords(data || [])
      }
      setLoading(false)
    }
    load()
  }, [person])

  return (
    <div className="min-h-screen bg-cream px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to={`/${person}`} className="text-emerald/70 text-sm">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-emerald">{displayName}'s History</h1>
        <div className="w-10"></div>
      </div>

      {loading ? (
        <p className="text-center text-emerald">Loading...</p>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-emerald/60">
          No records yet.
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-emerald/5"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-emerald text-lg">
                    {record.prayer}
                  </h3>
                  <p className="text-xs text-emerald/60">
                    {format(new Date(record.prayer_date), 'EEEE, d MMM yyyy')}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    record.is_late
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald/10 text-emerald'
                  }`}
                >
                  {record.is_late ? 'Late' : 'On time'}
                </span>
              </div>

              <p className="text-xs text-emerald/50 mb-3">
                Submitted at{' '}
                {format(new Date(record.marked_at), 'h:mm a')}
              </p>

              {record.photo_url && (
                <button
                  onClick={() => setViewPhoto(record.photo_url)}
                  className="w-full"
                >
                  <img
                    src={record.photo_url}
                    alt={`${record.prayer} proof`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo viewer modal */}
      {viewPhoto && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setViewPhoto(null)}
        >
          <div className="relative max-w-sm w-full">
            <img
              src={viewPhoto}
              alt="Prayer proof"
              className="w-full rounded-xl"
            />
            <button
              onClick={() => setViewPhoto(null)}
              className="absolute -top-3 -right-3 bg-white text-emerald w-8 h-8 rounded-full font-bold shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}