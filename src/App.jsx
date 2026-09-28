import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Weekly from './pages/Weekly'
import History from './pages/History'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:person" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/weekly" element={<Weekly />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App