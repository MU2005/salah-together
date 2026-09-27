import { Link } from 'react-router-dom'
import VerseCard from '../components/VerseCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-cream px-4 py-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald mb-1">Salah Together</h1>
        <p className="text-emerald/70 text-sm">Five prayers. Two brothers. One commitment.</p>
      </div>

      {/* Rotating Verse */}
      <div className="mb-8">
        <VerseCard />
      </div>

      {/* Profile Cards */}
      <div className="space-y-4">
        <Link
          to="/umar"
          className="block bg-white rounded-2xl p-5 shadow-sm border border-emerald/10 hover:border-emerald/30 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald text-white flex items-center justify-center text-xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald">Umar</h2>
              <p className="text-sm text-emerald/60">My prayers</p>
            </div>
          </div>
        </Link>

        <Link
          to="/abdullah"
          className="block bg-white rounded-2xl p-5 shadow-sm border border-emerald/10 hover:border-emerald/30 transition"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald text-white flex items-center justify-center text-xl font-bold">
              A
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald">Abdullah</h2>
              <p className="text-sm text-emerald/60">My prayers</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Weekly Challenge teaser */}
      <div className="mt-8 text-center">
        <Link
          to="/weekly"
          className="inline-block text-sm text-gold font-medium hover:underline"
        >
          🍕 View Weekly Challenge →
        </Link>
      </div>
    </div>
  )
}
