import { format } from 'date-fns'

export async function getPrayerTimes(date = new Date()) {
  const city = import.meta.env.VITE_PRAYER_CITY || 'Sialkot'
  const country = import.meta.env.VITE_PRAYER_COUNTRY || 'Pakistan'
  const method = import.meta.env.VITE_PRAYER_METHOD || 1
  const school = import.meta.env.VITE_PRAYER_SCHOOL || 1

  const dateStr = format(date, 'dd-MM-yyyy')

  const url = 'https://api.aladhan.com/v1/timingsByCity/' + dateStr +
    '?city=' + city +
    '&country=' + country +
    '&method=' + method +
    '&school=' + school

  try {
    const res = await fetch(url)
    const data = await res.json()

    if (data.code !== 200) throw new Error('Failed to fetch prayer times')

    const t = data.data.timings

    return {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
      date: data.data.date.readable,
      hijri: data.data.date.hijri.date
    }
  } catch (error) {
    console.error('Prayer times error:', error)
    return null
  }
}

export function timeToDate(timeStr, baseDate = new Date()) {
  if (!timeStr) return null
  const [hours, minutes] = timeStr.split(':').map(Number)
  const d = new Date(baseDate)
  d.setHours(hours, minutes, 0, 0)
  return d
}