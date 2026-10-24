import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

/**
 * RelatedDoctors Component:
 * - Displays related doctors with matching specialty on doctor profile page
 * - Dynamically reflects live availability status (Available / Not Available)
 */
const RealtedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()
    const [relDoc, setRelDocs] = useState([])

    // Fetch related doctors with the same speciality, excluding current doctor
    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDocs(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            {/* Section Title */}
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through other trusted doctors in the same specialty.</p>
            
            {/* Doctors List */}
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6 px-3 sm:px-0'>
                {
                    relDoc.slice(0, 5).map((item, index) => (
                        <div 
                            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }} 
                            className='border border-blue-200 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 rounded-xl' 
                            key={index}
                        >
                            {/* Doctor Image */}
                            <img className='bg-blue-50' src={item.image} alt={item.name} />       
                            {/* Doctor Details */}
                            <div className='p-4'>
                                {/* Dynamic Availability Status linked with Admin Dashboard */}
                                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* More Doctors Button */}
            <button 
                onClick={() => { navigate('/doctors'); scrollTo(0, 0); }} 
                className='bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-200 transition'
            >
                More
            </button>
        </div>
    )
}

export default RealtedDoctors
