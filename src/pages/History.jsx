// import { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { supabase } from '../services/supabase'
// import { format } from 'date-fns'

// export default function History() {
//   const [records, setRecords] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [viewPhoto, setViewPhoto] = useState(null)

//   useEffect(() => {
//     async function load() {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from('attendance')
//         .select('*')
//         .order('prayer_date', { ascending: false })
//         .order('marked_at', { ascending: false })

//       if (!error) setRecords(data || [])
//       setLoading(false)
//     }
//     load()
//   }, [])

//   return (
//     <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <Link to="/" className="text-muted text-sm">
//           ← Home
//         </Link>
//         <h1 className="text-xl font-bold text-text">Full History</h1>
//         <div className="w-10"></div>
//       </div>

//       {loading ? (
//         <p className="text-center text-muted">Loading...</p>
//       ) : records.length === 0 ? (
//         <div className="text-center py-16 text-muted">No records yet.</div>
//       ) : (
//         <div className="space-y-2">
//           {records.map((record) => (
//             <div
//               key={record.id}
//               className="card rounded-xl px-4 py-3 flex items-center gap-3"
//             >
//               {/* Left side - details */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-0.5">
//                   <span className="text-xs font-medium text-purple-light capitalize">
//                     {record.person}
//                   </span>
//                   <span className="text-muted">·</span>
//                   <h3 className="font-medium text-text">{record.prayer}</h3>
//                   <span
//                     className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
//                       record.is_late
//                         ? 'bg-amber-500/15 text-amber-300'
//                         : 'bg-purple/20 text-purple-light'
//                     }`}
//                   >
//                     {record.is_late ? 'Late' : 'On time'}
//                   </span>
//                 </div>
//                 <p className="text-xs text-muted truncate">
//                   {format(new Date(record.prayer_date), 'd MMM')} ·{' '}
//                   {format(new Date(record.marked_at), 'h:mm a')}
//                 </p>
//               </div>

//               {/* Right side - small thumbnail */}
//               {record.photo_url && (
//                 <button
//                   onClick={() => setViewPhoto(record.photo_url)}
//                   className="shrink-0"
//                 >
//                   <img
//                     src={record.photo_url}
//                     alt=""
//                     className="w-12 h-12 object-cover rounded-lg border border-white/10"
//                   />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Photo viewer modal */}
//       {viewPhoto && (
//         <div
//           className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//           onClick={() => setViewPhoto(null)}
//         >
//           <div className="relative max-w-sm w-full">
//             <img
//               src={viewPhoto}
//               alt="Prayer proof"
//               className="w-full rounded-2xl border border-purple/20"
//             />
//             <button
//               onClick={() => setViewPhoto(null)}
//               className="absolute -top-3 -right-3 bg-card text-text w-9 h-9 rounded-full font-bold border border-purple/30"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'

export default function History() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewPhoto, setViewPhoto] = useState(null)
  const [showStats, setShowStats] = useState(false)

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

  function getStats(person) {
    const personRecords = records.filter((r) => r.person === person)

    const onTime = personRecords.filter((r) => !r.is_late).length
    const late = personRecords.filter((r) => r.is_late).length

    if (personRecords.length === 0) {
      return { onTime: 0, late: 0, days: 0, from: null, to: null }
    }

    const dates = personRecords.map((r) => r.prayer_date).sort()
    const from = dates[0]
    const to = dates[dates.length - 1]
    const days = differenceInCalendarDays(parseISO(to), parseISO(from)) + 1

    return { onTime, late, days, from, to }
  }

  const umarStats = getStats('umar')
  const abdullahStats = getStats('abdullah')

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-muted text-sm">
          ← Home
        </Link>
        <h1 className="text-xl font-bold text-text">Full History</h1>
        <button
          onClick={() => setShowStats(true)}
          className="text-sm text-purple-light font-medium"
        >
          Stats
        </button>
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
                  {format(new Date(record.prayer_date), 'EEE, d MMM')} ·{' '}
                  {format(new Date(record.marked_at), 'h:mm a')}
                </p>
              </div>

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

      {/* Stats Popup */}
      {showStats && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card rounded-2xl p-5 max-w-sm w-full border border-purple/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text">Statistics</h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-muted text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Umar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-text">Umar</h3>
                {umarStats.days > 0 && (
                  <p className="text-xs text-muted">
                    {format(parseISO(umarStats.from), 'd MMM')} –{' '}
                    {format(parseISO(umarStats.to), 'd MMM')}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-purple/10 rounded-xl py-3">
                  <p className="text-xl font-bold text-purple-light">{umarStats.onTime}</p>
                  <p className="text-xs text-muted mt-0.5">On time</p>
                </div>
                <div className="bg-amber-500/10 rounded-xl py-3">
                  <p className="text-xl font-bold text-amber-300">{umarStats.late}</p>
                  <p className="text-xs text-muted mt-0.5">Late</p>
                </div>
              </div>
            </div>

            {/* Abdullah */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-text">Abdullah</h3>
                {abdullahStats.days > 0 && (
                  <p className="text-xs text-muted">
                    {format(parseISO(abdullahStats.from), 'd MMM')} –{' '}
                    {format(parseISO(abdullahStats.to), 'd MMM')}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-purple/10 rounded-xl py-3">
                  <p className="text-xl font-bold text-purple-light">{abdullahStats.onTime}</p>
                  <p className="text-xs text-muted mt-0.5">On time</p>
                </div>
                <div className="bg-amber-500/10 rounded-xl py-3">
                  <p className="text-xl font-bold text-amber-300">{abdullahStats.late}</p>
                  <p className="text-xs text-muted mt-0.5">Late</p>
                </div>
              </div>
            </div>
          </div>
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