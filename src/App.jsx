import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home' 
import MeetTheSouls from './components/MeetTheSouls'
import Gallery from './components/Gallery'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

function App() {

  return (
    <>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meetthesouls" element={<MeetTheSouls />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
        <Footer />
    </>
  )
}

export default App
