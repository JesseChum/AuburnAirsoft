import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from "./components/Footer/Footer"


import Home from './pages/Home/Home'
import About from './pages/About/About'
import Rules from './pages/Rules/Rules'
import Waiver from './pages/Waiver/Waiver'
import Events from "./pages/Events/Events"

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/waiver" element={<Waiver />} />
        <Route path="/events" element={<Events /> } />
      </Routes>
      <Footer/>
    </>
  )
}