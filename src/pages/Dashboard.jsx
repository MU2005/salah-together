import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import PrayerCard from '../components/PrayerCard'
import { getPrayerTimes, timeToDate } from '../services/prayerTimes'
import { supabase } from '../services/supabase'
import { compressImage } from '../services/compressImage'

const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']

export default function Dashboard() {
  const { person } = useParams()
  const displayName = person === 'umar' ? 'Umar' : 'Abdullah'

  const [times, setTimes] = useState(null)
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [viewPhoto, setViewPhoto] = useState(null) // for viewing uploaded photo
  const fileInputRef = useRef(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const prayerTimes = await getPrayerTimes()
      setTimes(prayerTimes)

      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('person', person)
        .eq('prayer_date', today)

      const map = {}
      data?.forEach((row) => {
        map[row.prayer] = row
      })
      setAttendance(map)
      setLoading(false)
    }
    load()
  }, [person])

  function getStatus(prayer) {
    // Already marked?
    if (attendance[prayer]) {
      return attendance[prayer].is_late ? 'late' : 'completed'
    }

    if (!times) return 'upcoming'

    const now = new Date()
    const start = timeToDate(times[prayer])
    let end

    if (prayer === 'Fajr') end = timeToDate(times.Sunrise)
    else if (prayer === 'Dhuhr') end = timeToDate(times.Asr)
    else if (prayer === 'Asr') end = timeToDate(times.Maghrib)
    else if (prayer === 'Maghrib') end = timeToDate(times.Isha)
    else {
      // Isha until ~4 AM next day
      end = new Date(start)
      end.setHours(4, 0, 0, 0)
      if (end <= start) end.setDate(end.getDate() + 1)
    }

    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'open'
    return 'missed' // window expired, can still mark late
  }

  async function handlePhotoSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo is too large. Please choose a smaller one.')
      return
    }

    try {
      const compressed = await compressImage(file)
      setPhotoFile(compressed)
      setPhotoPreview(URL.createObjectURL(compressed))
    } catch (err) {
      console.error(err)
      alert('Could not process the photo. Try another one.')
    }
  }

  async function handleMark(prayer) {
    if (!photoFile) {
      alert('Please take or upload a photo as proof.')
      return
    }

    setUploading(true)
    const isLate = getStatus(prayer) === 'missed'

    try {
      const today = new Date().toISOString().split('T')[0]
      const now = new Date().toISOString()
      const fileName = `${person}/${today}/${prayer}-${Date.now()}.jpg`

      // Upload photo
      const { error: uploadError } = await supabase.storage
        .from('prayer-proofs')
        .upload(fileName, photoFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('prayer-proofs')
        .getPublicUrl(fileName)

      const photoUrl = urlData.publicUrl

      // Save attendance
      const { error } = await supabase.from('attendance').upsert(
        {
          person,
          prayer,
          prayer_date: today,
          marked_at: now,
          performed_at: now,
          is_late: isLate,
          photo_url: photoUrl,
        },
        { onConflict: 'person,prayer,prayer_date' }
      )

      if (error) throw error

      setAttendance((prev) => ({
        ...prev,
        [prayer]: { is_late: isLate, marked_at: now, photo_url: photoUrl },
      }))

      // Reset
      setShowConfirm(null)
      setPhotoFile(null)
      setPhotoPreview(null)
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-emerald">Loading...</p>
      </div>
    )
  }

  const completedCount = Object.keys(attendance).length

  return (
    <div className="min-h-screen bg-cream px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-emerald/70 text-sm">
          ← Home
        </Link>
        <h1 className="text-xl font-bold text-emerald">
          Assalamu Alaikum, {displayName}
        </h1>
        <div className="w-10"></div>
      </div>

     {/* Progress */}
<div className="card rounded-2xl p-4 mb-6 text-center">
  <p className="text-sm text-muted">Today's progress</p>
  <p className="text-3xl font-bold text-text">{completedCount} / 5</p>
</div>

      {/* Prayer list */}
      <div className="space-y-3">
        {PRAYERS.map((prayer) => {
          const status = getStatus(prayer)

          return (
            <PrayerCard
              key={prayer}
              name={prayer}
              status={status}
              photoUrl={attendance[prayer]?.photo_url}
              onMark={() => {
                if (status === 'open' || status === 'missed') {
                  setShowConfirm(prayer)
                }
              }}
              onView={() => setViewPhoto(attendance[prayer]?.photo_url)}
            />
          )
        })}
      </div>

      {/* Link to History */}
      <div className="mt-8 text-center">
       <Link
  to="/history"
  className="text-sm text-gold font-medium hover:underline"
>
  View full history →
</Link>
      </div>
{/* Confirmation + Photo Modal */}
{showConfirm && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
    <div className="card rounded-2xl p-5 max-w-sm w-full border border-purple/20">
      <h3 className="text-lg font-semibold text-text mb-1">
        Confirm {showConfirm}
      </h3>
      <p className="text-sm text-muted mb-4">
        Allah knows what is in our hearts. Record truthfully.
      </p>

      <div className="mb-4">
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Proof"
              className="w-full h-40 object-cover rounded-xl"
            />
            <button
              onClick={() => {
                setPhotoFile(null)
                setPhotoPreview(null)
              }}
              className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-lg"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-purple/30 rounded-xl py-8 text-purple-light/80 text-sm hover:border-purple/50 transition"
          >
            📷 Take photo or upload proof
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowConfirm(null)
            setPhotoFile(null)
            setPhotoPreview(null)
          }}
          className="flex-1 py-2.5 rounded-xl border border-purple/30 text-muted"
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          onClick={() => handleMark(showConfirm)}
          disabled={uploading || !photoFile}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white font-medium disabled:opacity-50"
        >
          {uploading ? 'Saving...' : 'Yes, mark it'}
        </button>
      </div>
    </div>
  </div>
)}

{/* View Photo Modal */}
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
        className="absolute -top-3 -right-3 bg-card text-text w-9 h-9 rounded-full font-bold border border-purple/30 shadow-lg"
      >
        ✕
      </button>
    </div>
  </div>
)}
    </div>
  )
}