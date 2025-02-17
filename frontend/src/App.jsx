import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Contact from './pages/Contact'
import Myprofile from './pages/Myprofile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import About from './pages/About' // Import About component
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='  mx-4 sm:mx-[10%] '>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<Myprofile />} />
          <Route path='/my-appointment' element={<MyAppointment />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App
