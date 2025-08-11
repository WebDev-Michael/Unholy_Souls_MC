import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home' 
import About from './components/About'
import Cities from './components/Cities'
import Rules from './components/Rules'
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
          <Route path="/about" element={<About />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/meetthesouls" element={<MeetTheSouls />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
        <Footer />
    </>
  )
}

export default App
