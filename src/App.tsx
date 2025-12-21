import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from "./components/Footer/Footer"

import Home from './pages/Home/Home'
import About from './pages/About/About'
import Rules from './pages/Rules/Rules'
import Waiver from './pages/Waiver/Waiver'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/waiver" element={<Waiver />} />
      </Routes>
      <Footer/>
    </>
  )
}