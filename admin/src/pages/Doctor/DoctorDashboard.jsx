import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { DoctorContext } from '../../context/DoctorContext'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  return dashData && (
    <div className='m-5'>
      {/* Top 3 Stat Cards */}
      <div className='flex flex-wrap gap-4'>
        {/* Earnings Card */}
        <div className='flex items-center gap-3 bg-white p-4 min-w-56 rounded-xl border border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="Earnings" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>
              {currency ? currency : '$'} {dashData.earnings}
            </p>
            <p className='text-gray-400 text-sm'>Earnings</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex items-center gap-3 bg-white p-4 min-w-56 rounded-xl border border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.appointments}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex items-center gap-3 bg-white p-4 min-w-56 rounded-xl border border-gray-200 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{dashData.patients}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white mt-10 rounded-xl border border-gray-200 shadow-sm max-w-2xl'>
        {/* Card Header */}
        <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-100'>
          <img className='w-5' src={assets.list_icon} alt="" />
          <p className='font-semibold text-gray-700 text-base'>Latest Bookings</p>
        </div>

        {/* Bookings Rows */}
        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                className='flex items-center px-6 py-3.5 gap-4 hover:bg-gray-50 transition-colors'
                key={item._id || index}
              >
                <img
                  className='rounded-full w-10 h-10 object-cover bg-gray-50 flex-shrink-0'
                  src={item.userData?.image || assets.patients_icon}
                  onError={(e) => { e.currentTarget.src = assets.patients_icon }}
                  alt={item.userData?.name || 'Patient'}
                />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData?.name}</p>
                  <p className='text-gray-500 text-xs mt-0.5'>
                    Booking on {slotDateFormat && item.slotDate?.includes('-') ? slotDateFormat(item.slotDate) : item.slotDate}
                  </p>
                </div>

                {/* Status indicator or action buttons */}
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <div className='flex items-center gap-2'>
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className='w-10 cursor-pointer hover:scale-105 transition-transform'
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className='w-10 cursor-pointer hover:scale-105 transition-transform'
                      src={assets.tick_icon}
                      alt="Complete"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='text-center py-10 text-gray-400 text-sm'>
              No bookings yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
