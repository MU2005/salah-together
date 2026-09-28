import { useState, useEffect } from 'react'
import { verses } from '../data/verses'

export default function VerseCard() {
  const [verse, setVerse] = useState(null)

  useEffect(() => {
    const random = verses[Math.floor(Math.random() * verses.length)]
    setVerse(random)
  }, [])

  if (!verse) return null

  return (
    <div className="card rounded-2xl p-5 text-center">
      <p className="text-xs uppercase tracking-widest text-purple-light mb-3">
        A reminder for today
      </p>

      <p className="font-arabic text-2xl leading-relaxed text-text mb-3" dir="rtl">
        {verse.arabic}
      </p>

      <p className="text-purple-light/90 text-base mb-2 font-medium">
        {verse.urdu}
      </p>

      <p className="text-muted text-sm italic mb-3">
        {verse.english}
      </p>

      <p className="text-xs text-gold font-medium">
        {verse.reference}
      </p>
    </div>
  )
}