import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { format } from 'date-fns'

export default function History() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewPhoto, setViewPhoto] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('prayer_date', { ascending: false })
        .order('marked_at', { ascending: false })

      if (!error) setRecords(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-muted text-sm">
          ← Home
        </Link>
        <h1 className="text-xl font-bold text-text">Full History</h1>
        <div className="w-10"></div>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-muted">No records yet.</div>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="card rounded-xl px-4 py-3 flex items-center gap-3"
            >
              {/* Left side - details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-purple-light capitalize">
                    {record.person}
                  </span>
                  <span className="text-muted">·</span>
                  <h3 className="font-medium text-text">{record.prayer}</h3>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      record.is_late
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-purple/20 text-purple-light'
                    }`}
                  >
                    {record.is_late ? 'Late' : 'On time'}
                  </span>
                </div>
                <p className="text-xs text-muted truncate">
                  {format(new Date(record.prayer_date), 'd MMM')} ·{' '}
                  {format(new Date(record.marked_at), 'h:mm a')}
                </p>
              </div>

              {/* Right side - small thumbnail */}
              {record.photo_url && (
                <button
                  onClick={() => setViewPhoto(record.photo_url)}
                  className="shrink-0"
                >
                  <img
                    src={record.photo_url}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg border border-white/10"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setViewPhoto(null)}
        >
          <div className="relative max-w-sm w-full">
            <img
              src={viewPhoto}
              alt="Prayer proof"
              className="w-full rounded-2xl border border-purple/20"
            />
            <button
              onClick={() => setViewPhoto(null)}
              className="absolute -top-3 -right-3 bg-card text-text w-9 h-9 rounded-full font-bold border border-purple/30"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}