import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import VerseCard from '../components/VerseCard'

const rotatingLines = [
  // Surah At-Talaq 65:3
  "And whoever relies upon Allah — then He is sufficient for him.",
  // Surah Al-Baqarah 2:186
  "Indeed, I am near. I respond to the invocation of the supplicant when he calls upon Me.",
  // Surah Ghafir 40:60
  "Call upon Me; I will respond to you.",
  // Surah At-Talaq 65:3 (Urdu)
  "اور جو شخص اللہ پر بھروسہ کرتا ہے تو اللہ اس کے لیے کافی ہے۔",
  // Surah Al-Baqarah 2:186 (Urdu)
  "بے شک میں قریب ہوں، جب کوئی پکارنے والا مجھے پکارتا ہے تو میں اس کی دعا قبول کرتا ہوں۔",
  // Surah Ghafir 40:60 (Urdu)
  "تم مجھ سے دعا کرو، میں تمہاری دعا قبول کروں گا۔"
]

export default function Home() {
  const [line, setLine] = useState('')

  useEffect(() => {
    const random = rotatingLines[Math.floor(Math.random() * rotatingLines.length)]
    setLine(random)
  }, [])

  return (
    <div className="min-h-screen px-4 py-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-light to-purple text-transparent bg-clip-text mb-3">
          Salah Together
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
          {line}
        </p>
      </div>

      {/* Verse */}
      <div className="mb-8">
        <VerseCard />
      </div>

      {/* Profile Cards */}
      <div className="space-y-4 mb-8">
        <Link
          to="/umar"
          className="block card rounded-2xl p-5 hover:border-purple/40 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-xl font-bold text-white">
              U
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">Umar</h2>
              <p className="text-sm text-muted">My prayers</p>
            </div>
          </div>
        </Link>

        <Link
          to="/abdullah"
          className="block card rounded-2xl p-5 hover:border-purple/40 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-xl font-bold text-white">
              A
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text">Abdullah</h2>
              <p className="text-sm text-muted">My prayers</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/weekly"
          className="card rounded-xl py-4 text-center text-sm font-medium text-purple-light hover:border-purple/40 transition"
        >
          This Week
        </Link>
        <Link
          to="/history"
          className="card rounded-xl py-4 text-center text-sm font-medium text-purple-light hover:border-purple/40 transition"
        >
          Full History
        </Link>
      </div>
    </div>
  )
}