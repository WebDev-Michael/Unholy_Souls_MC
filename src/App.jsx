import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './components/Home' 
import MeetTheSouls from './components/MeetTheSouls'
import Gallery from './components/Gallery'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Login from './components/Login'
import AdminPanel from './components/AdminPanel'
import MemberManagement from './components/MemberManagement'
import ProtectedRoute from './components/ProtectedRoute'
import TestPage from './components/TestPage'

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meetthesouls" element={<MeetTheSouls />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/members" element={
          <ProtectedRoute>
            <MemberManagement />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}

export default App
