import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Classifier from './pages/Classifier'
import History from './pages/History'
import Reports from './pages/Reports'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'

function App() {
  return (
    <Routes>
      {/* La porte d'entrée de ton app React */}
      <Route path="/" element={<Login />} />
      
      {/* La zone logicielle */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/classifier" element={<Classifier />} />
      <Route path="/history" element={<History />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  )
}

export default App