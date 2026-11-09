import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { aToken, doctors, appointments, getAllDoctors, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
      getAllAppointments()
    }
  }, [aToken])

  // Calculate unique patients count from all booked appointments
  const uniquePatientsCount = appointments && appointments.length > 0
    ? new Set(appointments.map(item => item.userId)).size
    : 0

  return (
    <div className='m-5'>
      {/* Top 3 Stat Cards */}
      <div className='flex flex-wrap gap-4'>
        {/* Doctors Card */}
        <div className='flex items-center gap-3 bg-white p-4 min-w-56 rounded-xl border border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-sm'>
          <img className='w-14' src={assets.doctor_icon} alt="Doctors" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{doctors ? doctors.length : 0}</p>
            <p className='text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-3 bg-white p-4 min-w-56 rounded-xl border border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-sm'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{appointments ? appointments.length : 0}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-3 bg-white p-4 min-w-56 rounded-xl border border-gray-100 cursor-pointer hover:scale-105 transition-all shadow-sm'>
          <img className='w-14' src={assets.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{uniquePatientsCount}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Appointment Section */}
      <div className='bg-white mt-10 rounded-xl border border-gray-100 shadow-sm max-w-2xl'>
        {/* Header */}
        <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-100'>
          <img className='w-5' src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-700 text-base'>Latest Appointment</p>
        </div>

        {/* Latest Appointment Rows */}
        <div className='divide-y divide-gray-100'>
          {appointments && appointments.length > 0 ? (
            appointments.slice(0, 5).map((item, index) => (
              <div className='flex items-center px-6 py-3.5 gap-4 hover:bg-gray-50 transition-colors' key={index}>
                <img
                  className='rounded-full w-10 h-10 object-cover bg-blue-50 flex-shrink-0'
                  src={item.docData?.image || assets.doctor_icon}
                  alt={item.docData?.name || ''}
                />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.docData?.name}</p>
                  <p className='text-gray-500 text-xs mt-0.5'>
                    Booking on {slotDateFormat ? slotDateFormat(item.slotDate) : item.slotDate}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : (
                  <img className='w-10 cursor-pointer hover:scale-105 transition-transform' src={assets.cancel_icon} alt="Cancel" />
                )}
              </div>
            ))
          ) : (
            <div className='text-center py-10 text-gray-400 text-sm'>
              No appointments booked yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
