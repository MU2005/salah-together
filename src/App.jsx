import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Weekly from './pages/Weekly'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:person" element={<Dashboard />} />
        <Route path="/weekly" element={<Weekly />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
