import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-l font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item, index) => (
            <div className='relative border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              {/* Delete cross button on top-left corner */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete Dr. ${item.name}?`)) {
                    deleteDoctor(item._id);
                  }
                }}
                className='absolute top-2 left-2 z-10 w-7 h-7 bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 text-xs font-bold'
                title='Delete Doctor'
              >
                ✕
              </button>

              <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-300' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                <p className='text-zinc-600 text-sm '>{item.speciality}</p>
                <div className='flex items-center gap-1 text-sm mt-2'>
                  <input onChange={() => changeAvailability(item._id)} type="checkbox" name="" id="" checked={item.available} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorList
